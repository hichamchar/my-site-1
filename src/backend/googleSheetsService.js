/**
 * Google Sheets Service - École Management System
 * Service centralisé pour toutes les interactions avec Google Sheets
 */

import { fetch } from 'wix-fetch';

class GoogleSheetsService {
  constructor() {
    // Configuration Google Sheets API
    this.spreadsheetId = '1YOUR_SPREADSHEET_ID_HERE'; // À remplacer par votre ID
    this.apiKey = 'YOUR_GOOGLE_API_KEY_HERE'; // À remplacer par votre clé API
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    
    // Noms des feuilles (sheets) dans le fichier Google Sheets
    this.sheets = {
      STUDENTS: 'Élèves',
      CLASSES: 'Classes', 
      TEACHERS: 'Enseignants',
      PARENTS: 'Parents',
      ATTENDANCE: 'Présences',
      GRADES: 'Notes',
      MESSAGES: 'Messages'
    };
  }

  /**
   * Fonction utilitaire pour retry en cas d'échec API
   */
  async withRetry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`Opération échouée après ${maxRetries} tentatives: ${error.message}`);
        }
        // Délai exponentiel avant retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  /**
   * Fonction de base pour faire des requêtes à l'API Google Sheets
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}/${this.spreadsheetId}/${endpoint}?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'GET',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API Google Sheets: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Lire les données d'une feuille complète
   */
  async getSheetData(sheetName, range = '') {
    return this.withRetry(async () => {
      const fullRange = range ? `${sheetName}!${range}` : sheetName;
      const endpoint = `values/${fullRange}`;
      const response = await this.makeRequest(endpoint);
      return this.parseSheetData(response.values || []);
    });
  }

  /**
   * Convertit les données raw de Google Sheets en objets JavaScript
   */
  parseSheetData(values) {
    if (!values || values.length === 0) return [];
    
    const headers = values[0];
    return values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  /**
   * Générer un ID unique pour les nouvelles entrées
   */
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ============= GESTION DES ÉLÈVES =============

  /**
   * Récupérer tous les élèves
   */
  async getStudents() {
    return this.getSheetData(this.sheets.STUDENTS);
  }

  /**
   * Récupérer un élève par son ID
   */
  async getStudentById(studentId) {
    const students = await this.getStudents();
    return students.find(student => student.ID === studentId);
  }

  /**
   * Récupérer les élèves d'un parent
   */
  async getStudentsByParentId(parentId) {
    const students = await this.getStudents();
    return students.filter(student => student.ParentID === parentId);
  }

  // ============= GESTION DES CLASSES =============

  /**
   * Récupérer toutes les classes
   */
  async getClasses() {
    return this.getSheetData(this.sheets.CLASSES);
  }

  /**
   * Récupérer une classe par son ID
   */
  async getClassById(classId) {
    const classes = await this.getClasses();
    return classes.find(cls => cls.ID === classId);
  }

  // ============= GESTION DES ENSEIGNANTS =============

  /**
   * Récupérer tous les enseignants
   */
  async getTeachers() {
    return this.getSheetData(this.sheets.TEACHERS);
  }

  /**
   * Récupérer un enseignant par son ID
   */
  async getTeacherById(teacherId) {
    const teachers = await this.getTeachers();
    return teachers.find(teacher => teacher.ID === teacherId);
  }

  // ============= GESTION DES PARENTS =============

  /**
   * Récupérer tous les parents
   */
  async getParents() {
    return this.getSheetData(this.sheets.PARENTS);
  }

  /**
   * Récupérer un parent par son ID
   */
  async getParentById(parentId) {
    const parents = await this.getParents();
    return parents.find(parent => parent.ID === parentId);
  }

  /**
   * Récupérer un parent par email (pour l'authentification)
   */
  async getParentByEmail(email) {
    const parents = await this.getParents();
    return parents.find(parent => parent.Email === email);
  }

  // ============= GESTION DES PRÉSENCES =============

  /**
   * Récupérer les présences pour une date donnée
   */
  async getAttendanceByDate(date) {
    const attendance = await this.getSheetData(this.sheets.ATTENDANCE);
    return attendance.filter(record => record.Date === date);
  }

  /**
   * Récupérer l'historique des présences d'un élève
   */
  async getAttendanceByStudentId(studentId, limit = 30) {
    const attendance = await this.getSheetData(this.sheets.ATTENDANCE);
    return attendance
      .filter(record => record.StudentID === studentId)
      .sort((a, b) => new Date(b.Date) - new Date(a.Date))
      .slice(0, limit);
  }

  // ============= GESTION DES NOTES =============

  /**
   * Récupérer les notes d'un élève
   */
  async getGradesByStudentId(studentId) {
    const grades = await this.getSheetData(this.sheets.GRADES);
    return grades
      .filter(grade => grade.StudentID === studentId)
      .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  }

  /**
   * Récupérer les notes d'une classe pour une matière
   */
  async getGradesByClassAndSubject(classId, subject) {
    const grades = await this.getSheetData(this.sheets.GRADES);
    const students = await this.getStudents();
    
    const classStudents = students.filter(student => student.ClassID === classId);
    const studentIds = classStudents.map(student => student.ID);
    
    return grades.filter(grade => 
      studentIds.includes(grade.StudentID) && grade.Subject === subject
    );
  }

  // ============= GESTION DES MESSAGES =============

  /**
   * Récupérer les messages pour un utilisateur
   */
  async getMessagesByUserId(userId, limit = 50) {
    const messages = await this.getSheetData(this.sheets.MESSAGES);
    return messages
      .filter(message => 
        message.SenderID === userId || message.ReceiverID === userId
      )
      .sort((a, b) => new Date(b.Date) - new Date(a.Date))
      .slice(0, limit);
  }

  /**
   * Récupérer une conversation entre deux utilisateurs
   */
  async getConversation(userId1, userId2, limit = 100) {
    const messages = await this.getSheetData(this.sheets.MESSAGES);
    return messages
      .filter(message => 
        (message.SenderID === userId1 && message.ReceiverID === userId2) ||
        (message.SenderID === userId2 && message.ReceiverID === userId1)
      )
      .sort((a, b) => new Date(a.Date) - new Date(b.Date))
      .slice(-limit);
  }

  /**
   * Compter les messages non lus pour un utilisateur
   */
  async getUnreadMessageCount(userId) {
    const messages = await this.getSheetData(this.sheets.MESSAGES);
    return messages.filter(message => 
      message.ReceiverID === userId && message.Read !== 'true'
    ).length;
  }

  // ============= FONCTIONS D'ÉCRITURE (nécessitent l'API OAuth) =============
  // Note: Ces fonctions nécessitent une authentification OAuth Google
  // pour écrire dans les feuilles. Elles sont préparées pour l'implémentation future.

  /**
   * Ajouter un nouveau message
   */
  async addMessage(senderID, receiverID, content, type = 'message') {
    const messageData = {
      ID: this.generateId(),
      SenderID: senderID,
      ReceiverID: receiverID,
      Date: new Date().toISOString(),
      Content: content,
      Read: 'false',
      Type: type
    };
    
    // TODO: Implémenter l'écriture via l'API Google Sheets
    console.log('Message à ajouter:', messageData);
    return messageData;
  }

  /**
   * Marquer un message comme lu
   */
  async markMessageAsRead(messageId) {
    // TODO: Implémenter la mise à jour via l'API Google Sheets
    console.log('Marquer message comme lu:', messageId);
  }

  /**
   * Ajouter une présence
   */
  async addAttendance(studentId, date, present, justified = false, note = '', teacherId) {
    const attendanceData = {
      Date: date,
      StudentID: studentId,
      Present: present ? 'true' : 'false',
      Justified: justified ? 'true' : 'false',
      Note: note,
      TeacherID: teacherId
    };
    
    // TODO: Implémenter l'écriture via l'API Google Sheets
    console.log('Présence à ajouter:', attendanceData);
    return attendanceData;
  }

  // ============= STATISTIQUES ET RAPPORTS =============

  /**
   * Calculer les statistiques de présence d'un élève
   */
  async getStudentAttendanceStats(studentId, startDate, endDate) {
    const attendance = await this.getAttendanceByStudentId(studentId);
    
    const filteredAttendance = attendance.filter(record => {
      const recordDate = new Date(record.Date);
      return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });

    const totalDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter(record => record.Present === 'true').length;
    const absentDays = totalDays - presentDays;
    const justifiedAbsences = filteredAttendance.filter(record => 
      record.Present === 'false' && record.Justified === 'true'
    ).length;

    return {
      totalDays,
      presentDays,
      absentDays,
      justifiedAbsences,
      attendanceRate: totalDays > 0 ? (presentDays / totalDays * 100).toFixed(1) : 0
    };
  }

  /**
   * Calculer la moyenne des notes d'un élève
   */
  async getStudentGradeAverage(studentId, subject = null) {
    const grades = await this.getGradesByStudentId(studentId);
    
    const filteredGrades = subject 
      ? grades.filter(grade => grade.Subject === subject)
      : grades;

    if (filteredGrades.length === 0) return null;

    const total = filteredGrades.reduce((sum, grade) => sum + parseFloat(grade.Grade || 0), 0);
    return (total / filteredGrades.length).toFixed(2);
  }
}

// Export du service pour utilisation dans d'autres modules
export default GoogleSheetsService; 