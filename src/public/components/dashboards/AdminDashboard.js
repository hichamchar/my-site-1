/**
 * Admin Dashboard - École Management System
 * Tableau de bord pour les administrateurs et enseignants
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider.js';
import GoogleSheetsService from '../../backend/googleSheetsService.js';

const AdminDashboard = () => {
  const { user, userRole, isAdmin, isTeacher } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    totalParents: 0,
    todayAttendanceRate: 0,
    unreadMessages: 0,
    recentActivity: []
  });

  const googleSheets = new GoogleSheetsService();

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Charger les données du tableau de bord
   */
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Charger toutes les données en parallèle
      const [students, classes, teachers, parents, messages] = await Promise.all([
        googleSheets.getStudents(),
        googleSheets.getClasses(),
        googleSheets.getTeachers(),
        googleSheets.getParents(),
        googleSheets.getMessagesByUserId(user?.teacherData?.ID || user?.email, 10)
      ]);

      // Calculer les statistiques de présence pour aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await googleSheets.getAttendanceByDate(today);
      const attendanceRate = calculateAttendanceRate(todayAttendance, students.length);

      // Compter les messages non lus
      const unreadCount = await googleSheets.getUnreadMessageCount(
        user?.teacherData?.ID || user?.email
      );

      // Générer les activités récentes
      const recentActivity = await generateRecentActivity(students, messages);

      setStats({
        totalStudents: students.length,
        totalClasses: classes.length,
        totalTeachers: teachers.length,
        totalParents: parents.length,
        todayAttendanceRate: attendanceRate,
        unreadMessages: unreadCount,
        recentActivity
      });

    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculer le taux de présence
   */
  const calculateAttendanceRate = (attendanceRecords, totalStudents) => {
    if (totalStudents === 0) return 0;
    const presentCount = attendanceRecords.filter(record => record.Present === 'true').length;
    return Math.round((presentCount / totalStudents) * 100);
  };

  /**
   * Générer les activités récentes
   */
  const generateRecentActivity = async (students, messages) => {
    const activities = [];

    // Ajouter les messages récents
    messages.slice(0, 3).forEach(message => {
      activities.push({
        type: 'message',
        title: 'Nouveau message',
        description: `Message de ${message.SenderID}`,
        time: new Date(message.Date).toLocaleTimeString('fr-FR'),
        icon: '✉️'
      });
    });

    // Ajouter les nouveaux élèves (derniers 7 jours)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const newStudents = students.filter(student => {
      const createdDate = new Date(student.CreatedDate || student.DateOfBirth);
      return createdDate > weekAgo;
    });

    newStudents.slice(0, 2).forEach(student => {
      activities.push({
        type: 'student',
        title: 'Nouvel élève',
        description: `${student.FirstName} ${student.LastName}`,
        time: 'Cette semaine',
        icon: '👨‍🎓'
      });
    });

    return activities.slice(0, 5); // Limiter à 5 activités
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement du tableau de bord...</p>
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
          <button onClick={loadDashboardData} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* En-tête du dashboard */}
      <div className="dashboard-header">
        <h1>
          Tableau de bord {isAdmin() ? 'Administration' : 'Enseignant'}
        </h1>
        <p className="welcome-message">
          Bonjour {user?.name || user?.email} ! 
          Voici un aperçu de votre école aujourd'hui.
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <div className="stat-card students">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Élèves</p>
          </div>
        </div>

        <div className="stat-card classes">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>{stats.totalClasses}</h3>
            <p>Classes</p>
          </div>
        </div>

        <div className="stat-card teachers">
          <div className="stat-icon">👩‍🏫</div>
          <div className="stat-content">
            <h3>{stats.totalTeachers}</h3>
            <p>Enseignants</p>
          </div>
        </div>

        <div className="stat-card parents">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-content">
            <h3>{stats.totalParents}</h3>
            <p>Parents</p>
          </div>
        </div>

        <div className="stat-card attendance">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.todayAttendanceRate}%</h3>
            <p>Présence aujourd'hui</p>
          </div>
        </div>

        <div className="stat-card messages">
          <div className="stat-icon">💌</div>
          <div className="stat-content">
            <h3>{stats.unreadMessages}</h3>
            <p>Messages non lus</p>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <button className="action-button primary">
            <span className="action-icon">➕</span>
            <span className="action-text">Ajouter un élève</span>
          </button>

          <button className="action-button secondary">
            <span className="action-icon">📝</span>
            <span className="action-text">Prendre les présences</span>
          </button>

          <button className="action-button secondary">
            <span className="action-icon">📊</span>
            <span className="action-text">Saisir des notes</span>
          </button>

          <button className="action-button secondary">
            <span className="action-icon">✉️</span>
            <span className="action-text">Envoyer un message</span>
          </button>

          {isAdmin() && (
            <>
              <button className="action-button warning">
                <span className="action-icon">👩‍🏫</span>
                <span className="action-text">Gérer les enseignants</span>
              </button>

              <button className="action-button warning">
                <span className="action-icon">🏫</span>
                <span className="action-text">Gérer les classes</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Section en deux colonnes */}
      <div className="dashboard-content">
        {/* Activités récentes */}
        <div className="recent-activity">
          <h2>Activités récentes</h2>
          <div className="activity-list">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Informations importantes */}
        <div className="important-info">
          <h2>Informations importantes</h2>
          <div className="info-cards">
            <div className="info-card priority-high">
              <h4>🚨 Urgent</h4>
              <p>Réunion parents-professeurs le 15 mars</p>
              <small>Il y a 2 jours</small>
            </div>

            <div className="info-card priority-medium">
              <h4>📅 Rappel</h4>
              <p>Vacances de printemps du 20 au 28 mars</p>
              <small>Il y a 1 semaine</small>
            </div>

            <div className="info-card priority-low">
              <h4>ℹ️ Information</h4>
              <p>Nouvelle procédure de sécurité mise en place</p>
              <small>Il y a 2 semaines</small>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de présence (placeholder) */}
      <div className="attendance-chart">
        <h2>Évolution des présences cette semaine</h2>
        <div className="chart-placeholder">
          <p>📈 Graphique de présences à implémenter</p>
          <p>Taux moyen: {stats.todayAttendanceRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 