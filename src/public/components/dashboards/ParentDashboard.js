/**
 * Parent Dashboard - École Management System
 * Tableau de bord personnalisé pour les parents
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider.js';
import GoogleSheetsService from '../../backend/googleSheetsService.js';

const ParentDashboard = () => {
  const { user, getRoleSpecificData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const googleSheets = new GoogleSheetsService();
  const roleData = getRoleSpecificData();

  useEffect(() => {
    loadParentDashboardData();
  }, []);

  useEffect(() => {
    // Sélectionner automatiquement le premier enfant
    if (childrenData.length > 0 && !selectedChild) {
      setSelectedChild(childrenData[0]);
    }
  }, [childrenData, selectedChild]);

  /**
   * Charger les données du tableau de bord parent
   */
  const loadParentDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!roleData?.children || roleData.children.length === 0) {
        setError('Aucun enfant trouvé dans votre compte');
        return;
      }

      // Charger les données détaillées pour chaque enfant
      const childrenDataPromises = roleData.children.map(async (child) => {
        const [attendanceStats, recentGrades, recentAttendance, childClass] = await Promise.all([
          getChildAttendanceStats(child.ID),
          googleSheets.getGradesByStudentId(child.ID),
          googleSheets.getAttendanceByStudentId(child.ID, 7),
          googleSheets.getClassById(child.ClassID)
        ]);

        return {
          ...child,
          attendanceStats,
          recentGrades: recentGrades.slice(0, 5),
          recentAttendance,
          class: childClass,
          gradeAverage: await googleSheets.getStudentGradeAverage(child.ID)
        };
      });

      const enrichedChildren = await Promise.all(childrenDataPromises);
      setChildrenData(enrichedChildren);

      // Compter les messages non lus
      const unreadCount = await googleSheets.getUnreadMessageCount(roleData.parentData.ID);
      setUnreadMessages(unreadCount);

    } catch (err) {
      console.error('Erreur lors du chargement du dashboard parent:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculer les statistiques de présence d'un enfant
   */
  const getChildAttendanceStats = async (childId) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 derniers jours

    return await googleSheets.getStudentAttendanceStats(
      childId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  };

  /**
   * Formater une date en français
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Obtenir la couleur selon la note
   */
  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 16) return 'excellent';
    if (numGrade >= 14) return 'good';
    if (numGrade >= 12) return 'fair';
    if (numGrade >= 10) return 'passing';
    return 'failing';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des informations de vos enfants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-message">
          <h3>❌ Erreur</h3>
          <p>{error}</p>
          <button onClick={loadParentDashboardData} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (childrenData.length === 0) {
    return (
      <div className="dashboard-empty">
        <h2>Aucun enfant trouvé</h2>
        <p>Veuillez contacter l'administration pour vérifier votre compte.</p>
      </div>
    );
  }

  return (
    <div className="parent-dashboard">
      {/* En-tête avec sélecteur d'enfant */}
      <div className="dashboard-header">
        <h1>Espace Parents</h1>
        <p className="welcome-message">
          Bonjour {roleData.parentData.FirstName} {roleData.parentData.LastName}
        </p>
        
        {childrenData.length > 1 && (
          <div className="child-selector">
            <label htmlFor="child-select">Sélectionnez un enfant :</label>
            <select 
              id="child-select"
              value={selectedChild?.ID || ''}
              onChange={(e) => {
                const child = childrenData.find(c => c.ID === e.target.value);
                setSelectedChild(child);
              }}
              className="child-select"
            >
              {childrenData.map(child => (
                <option key={child.ID} value={child.ID}>
                  {child.FirstName} {child.LastName} - {child.class?.Name || 'Classe inconnue'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedChild && (
        <>
          {/* Informations de l'enfant sélectionné */}
          <div className="child-overview">
            <div className="child-info">
              <h2>👨‍🎓 {selectedChild.FirstName} {selectedChild.LastName}</h2>
              <div className="child-details">
                <p><strong>Classe :</strong> {selectedChild.class?.Name || 'Non assignée'}</p>
                <p><strong>Enseignant :</strong> {selectedChild.class?.TeacherName || 'À déterminer'}</p>
                <p><strong>Année scolaire :</strong> {selectedChild.class?.AcademicYear || '2023-2024'}</p>
              </div>
            </div>

            {/* Messages non lus */}
            {unreadMessages > 0 && (
              <div className="unread-messages-alert">
                <span className="message-icon">💌</span>
                <span>{unreadMessages} message{unreadMessages > 1 ? 's' : ''} non lu{unreadMessages > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Statistiques rapides */}
          <div className="quick-stats">
            <div className="stat-card attendance-stat">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{selectedChild.attendanceStats?.attendanceRate || 0}%</h3>
                <p>Taux de présence (30j)</p>
                <small>
                  {selectedChild.attendanceStats?.presentDays || 0} présent{selectedChild.attendanceStats?.presentDays > 1 ? 's' : ''} / {selectedChild.attendanceStats?.totalDays || 0} jours
                </small>
              </div>
            </div>

            <div className="stat-card grade-stat">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>{selectedChild.gradeAverage || 'N/A'}</h3>
                <p>Moyenne générale</p>
                <small>Toutes matières confondues</small>
              </div>
            </div>

            <div className="stat-card absence-stat">
              <div className="stat-icon">🏠</div>
              <div className="stat-content">
                <h3>{selectedChild.attendanceStats?.absentDays || 0}</h3>
                <p>Absences (30j)</p>
                <small>
                  {selectedChild.attendanceStats?.justifiedAbsences || 0} justifiée{selectedChild.attendanceStats?.justifiedAbsences > 1 ? 's' : ''}
                </small>
              </div>
            </div>
          </div>

          {/* Contenu principal en deux colonnes */}
          <div className="dashboard-content">
            {/* Présences récentes */}
            <div className="recent-attendance">
              <h3>📅 Présences récentes</h3>
              <div className="attendance-list">
                {selectedChild.recentAttendance && selectedChild.recentAttendance.length > 0 ? (
                  selectedChild.recentAttendance.map((attendance, index) => (
                    <div key={index} className={`attendance-item ${attendance.Present === 'true' ? 'present' : 'absent'}`}>
                      <div className="attendance-date">
                        {formatDate(attendance.Date)}
                      </div>
                      <div className="attendance-status">
                        {attendance.Present === 'true' ? (
                          <span className="status-present">✅ Présent</span>
                        ) : (
                          <span className="status-absent">
                            ❌ Absent {attendance.Justified === 'true' && '(Justifié)'}
                          </span>
                        )}
                      </div>
                      {attendance.Note && (
                        <div className="attendance-note">
                          <small>Note: {attendance.Note}</small>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>Aucune donnée de présence récente</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes récentes */}
            <div className="recent-grades">
              <h3>📊 Notes récentes</h3>
              <div className="grades-list">
                {selectedChild.recentGrades && selectedChild.recentGrades.length > 0 ? (
                  selectedChild.recentGrades.map((grade, index) => (
                    <div key={index} className="grade-item">
                      <div className="grade-header">
                        <span className="grade-subject">{grade.Subject}</span>
                        <span className={`grade-value ${getGradeColor(grade.Grade)}`}>
                          {grade.Grade}/20
                        </span>
                      </div>
                      <div className="grade-date">
                        {formatDate(grade.Date)}
                      </div>
                      {grade.Comment && (
                        <div className="grade-comment">
                          <small>{grade.Comment}</small>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>Aucune note récente</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions rapides pour parents */}
          <div className="parent-actions">
            <h3>Actions rapides</h3>
            <div className="actions-grid">
              <button className="action-button primary">
                <span className="action-icon">✉️</span>
                <span className="action-text">Contacter l'enseignant</span>
              </button>

              <button className="action-button secondary">
                <span className="action-icon">📋</span>
                <span className="action-text">Justifier une absence</span>
              </button>

              <button className="action-button secondary">
                <span className="action-icon">📊</span>
                <span className="action-text">Voir toutes les notes</span>
              </button>

              <button className="action-button secondary">
                <span className="action-icon">📅</span>
                <span className="action-text">Calendrier scolaire</span>
              </button>
            </div>
          </div>

          {/* Calendrier des événements à venir */}
          <div className="upcoming-events">
            <h3>📅 Événements à venir</h3>
            <div className="events-list">
              <div className="event-item">
                <div className="event-date">15 Mars</div>
                <div className="event-content">
                  <h4>Réunion parents-professeurs</h4>
                  <p>De 17h à 19h - Salle de classe</p>
                </div>
              </div>
              
              <div className="event-item">
                <div className="event-date">20-28 Mars</div>
                <div className="event-content">
                  <h4>Vacances de printemps</h4>
                  <p>École fermée</p>
                </div>
              </div>
              
              <div className="event-item">
                <div className="event-date">5 Avril</div>
                <div className="event-content">
                  <h4>Sortie éducative</h4>
                  <p>Musée des Sciences - Autorisation requise</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentDashboard; 