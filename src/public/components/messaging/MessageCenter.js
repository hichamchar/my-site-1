/**
 * Message Center - École Management System
 * Centre de messagerie pour la communication parents-enseignants
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider.js';
import GoogleSheetsService from '../../backend/googleSheetsService.js';

const MessageCenter = () => {
  const { user, userRole, isParent, isTeacher, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [showNewMessage, setShowNewMessage] = useState(false);

  const googleSheets = new GoogleSheetsService();

  useEffect(() => {
    loadMessageData();
  }, []);

  /**
   * Charger les données de messagerie
   */
  const loadMessageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = getUserId();
      
      // Charger les messages de l'utilisateur
      const userMessages = await googleSheets.getMessagesByUserId(userId, 100);
      
      // Organiser les messages en conversations
      const conversationsMap = new Map();
      
      userMessages.forEach(message => {
        const otherUserId = message.SenderID === userId ? message.ReceiverID : message.SenderID;
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            participantId: otherUserId,
            participantName: 'Utilisateur inconnu',
            lastMessage: message,
            unreadCount: 0,
            messages: []
          });
        }
        
        const conversation = conversationsMap.get(otherUserId);
        conversation.messages.push(message);
        
        // Mettre à jour le dernier message si plus récent
        if (new Date(message.Date) > new Date(conversation.lastMessage.Date)) {
          conversation.lastMessage = message;
        }
        
        // Compter les messages non lus
        if (message.ReceiverID === userId && message.Read !== 'true') {
          conversation.unreadCount++;
        }
      });

      // Charger les noms des participants
      const conversationsList = Array.from(conversationsMap.values());
      await enrichConversationsWithNames(conversationsList);
      
      // Trier par date du dernier message
      conversationsList.sort((a, b) => 
        new Date(b.lastMessage.Date) - new Date(a.lastMessage.Date)
      );

      setConversations(conversationsList);
      
      // Charger les contacts disponibles
      await loadContacts();

    } catch (err) {
      console.error('Erreur lors du chargement de la messagerie:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enrichir les conversations avec les noms des participants
   */
  const enrichConversationsWithNames = async (conversations) => {
    const [teachers, parents] = await Promise.all([
      googleSheets.getTeachers(),
      googleSheets.getParents()
    ]);

    conversations.forEach(conversation => {
      // Chercher dans les enseignants
      const teacher = teachers.find(t => t.ID === conversation.participantId);
      if (teacher) {
        conversation.participantName = `${teacher.FirstName} ${teacher.LastName}`;
        conversation.participantRole = 'teacher';
        return;
      }

      // Chercher dans les parents
      const parent = parents.find(p => p.ID === conversation.participantId);
      if (parent) {
        conversation.participantName = `${parent.FirstName} ${parent.LastName}`;
        conversation.participantRole = 'parent';
        return;
      }
    });
  };

  /**
   * Charger la liste des contacts disponibles
   */
  const loadContacts = async () => {
    try {
      let availableContacts = [];

      if (isParent()) {
        // Parents peuvent contacter les enseignants
        const teachers = await googleSheets.getTeachers();
        availableContacts = teachers.map(teacher => ({
          id: teacher.ID,
          name: `${teacher.FirstName} ${teacher.LastName}`,
          role: 'teacher',
          email: teacher.Email
        }));
      } else if (isTeacher() || isAdmin()) {
        // Enseignants peuvent contacter parents et autres enseignants
        const [teachers, parents] = await Promise.all([
          googleSheets.getTeachers(),
          googleSheets.getParents()
        ]);

        const teacherContacts = teachers
          .filter(teacher => teacher.ID !== getUserId())
          .map(teacher => ({
            id: teacher.ID,
            name: `${teacher.FirstName} ${teacher.LastName}`,
            role: 'teacher',
            email: teacher.Email
          }));

        const parentContacts = parents.map(parent => ({
          id: parent.ID,
          name: `${parent.FirstName} ${parent.LastName}`,
          role: 'parent',
          email: parent.Email
        }));

        availableContacts = [...teacherContacts, ...parentContacts];
      }

      setContacts(availableContacts);
    } catch (err) {
      console.error('Erreur lors du chargement des contacts:', err);
    }
  };

  /**
   * Obtenir l'ID de l'utilisateur actuel
   */
  const getUserId = () => {
    if (isParent()) {
      return user?.parentData?.ID || user?.email;
    } else if (isTeacher()) {
      return user?.teacherData?.ID || user?.email;
    }
    return user?.email;
  };

  /**
   * Sélectionner une conversation
   */
  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages.sort((a, b) => new Date(a.Date) - new Date(b.Date)));
    
    // Marquer les messages comme lus
    markMessagesAsRead(conversation);
  };

  /**
   * Marquer les messages comme lus
   */
  const markMessagesAsRead = async (conversation) => {
    const userId = getUserId();
    const unreadMessages = conversation.messages.filter(
      msg => msg.ReceiverID === userId && msg.Read !== 'true'
    );

    for (const message of unreadMessages) {
      try {
        await googleSheets.markMessageAsRead(message.ID);
        message.Read = 'true';
      } catch (err) {
        console.error('Erreur lors du marquage comme lu:', err);
      }
    }

    // Mettre à jour le compteur local
    conversation.unreadCount = 0;
    setConversations([...conversations]);
  };

  /**
   * Envoyer un message
   */
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);

    try {
      const messageData = await googleSheets.addMessage(
        getUserId(),
        selectedConversation.participantId,
        newMessage.trim(),
        'message'
      );

      // Ajouter le message à la conversation locale
      const updatedMessages = [...messages, messageData];
      setMessages(updatedMessages);

      // Mettre à jour la conversation
      selectedConversation.messages.push(messageData);
      selectedConversation.lastMessage = messageData;

      // Vider le champ de saisie
      setNewMessage('');

      // Remonter la conversation en haut de la liste
      const updatedConversations = conversations.filter(
        conv => conv.participantId !== selectedConversation.participantId
      );
      updatedConversations.unshift(selectedConversation);
      setConversations(updatedConversations);

    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  /**
   * Démarrer une nouvelle conversation
   */
  const startNewConversation = (contact) => {
    const existingConversation = conversations.find(
      conv => conv.participantId === contact.id
    );

    if (existingConversation) {
      selectConversation(existingConversation);
    } else {
      const newConversation = {
        participantId: contact.id,
        participantName: contact.name,
        participantRole: contact.role,
        lastMessage: null,
        unreadCount: 0,
        messages: []
      };
      setSelectedConversation(newConversation);
      setMessages([]);
    }

    setShowNewMessage(false);
  };

  /**
   * Formater l'heure d'un message
   */
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="message-center-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement de vos messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-center">
      <div className="message-header">
        <h1>💌 Centre de messagerie</h1>
        <button 
          className="new-message-btn"
          onClick={() => setShowNewMessage(true)}
        >
          ➕ Nouveau message
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="message-layout">
        {/* Liste des conversations */}
        <div className="conversations-panel">
          <h3>Conversations</h3>
          <div className="conversations-list">
            {conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div
                  key={index}
                  className={`conversation-item ${
                    selectedConversation?.participantId === conversation.participantId ? 'selected' : ''
                  } ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {conversation.participantName}
                      <span className={`role-badge ${conversation.participantRole}`}>
                        {conversation.participantRole === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}
                      </span>
                    </div>
                    {conversation.lastMessage && (
                      <div className="last-message">
                        {conversation.lastMessage.Content.substring(0, 50)}
                        {conversation.lastMessage.Content.length > 50 ? '...' : ''}
                      </div>
                    )}
                    <div className="conversation-time">
                      {conversation.lastMessage && formatMessageTime(conversation.lastMessage.Date)}
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="unread-badge">{conversation.unreadCount}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <p>Aucune conversation</p>
                <button onClick={() => setShowNewMessage(true)}>
                  Envoyer votre premier message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Zone de messages */}
        <div className="messages-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <h3>
                  Conversation avec {selectedConversation.participantName}
                  <span className={`role-badge ${selectedConversation.participantRole}`}>
                    {selectedConversation.participantRole === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}
                  </span>
                </h3>
              </div>

              <div className="messages-list">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message-item ${
                        message.SenderID === getUserId() ? 'sent' : 'received'
                      }`}
                    >
                      <div className="message-content">
                        {message.Content}
                      </div>
                      <div className="message-time">
                        {formatMessageTime(message.Date)}
                        {message.SenderID === getUserId() && message.Read === 'true' && (
                          <span className="read-indicator">✓✓</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <p>Aucun message dans cette conversation</p>
                    <p>Commencez par envoyer un message !</p>
                  </div>
                )}
              </div>

              <div className="message-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  rows="3"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="send-button"
                >
                  {sendingMessage ? '📤' : '➤'} Envoyer
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="placeholder-content">
                <h3>💬 Sélectionnez une conversation</h3>
                <p>Choisissez une conversation dans la liste ou commencez une nouvelle discussion</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal nouveau message */}
      {showNewMessage && (
        <div className="modal-overlay" onClick={() => setShowNewMessage(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nouveau message</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewMessage(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <h4>Sélectionnez un destinataire :</h4>
              <div className="contacts-list">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    className="contact-item"
                    onClick={() => startNewConversation(contact)}
                  >
                    <span className="contact-name">{contact.name}</span>
                    <span className={`role-badge ${contact.role}`}>
                      {contact.role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageCenter; 