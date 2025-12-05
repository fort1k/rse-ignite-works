import React, { useState, useEffect } from 'react';
import '../styles/Resultat.css';
import Header from './components/Header';
import StudentSelector from './components/StudentSelector';
import DefenseSystem from './components/DefenseSystem';
import StatsGrid from './components/StatsGrid';
import Dashboard from './components/Dashboard';
import Alert from './components/Alert';
import { studentsData } from './utils/chartData';

function Resultat() {
  const [currentStudent, setCurrentStudent] = useState('asterix');
  const [alerts, setAlerts] = useState([]);
  const [student, setStudent] = useState(studentsData.asterix);

  useEffect(() => {
    setStudent(studentsData[currentStudent]);
    
    // Show welcome alert
    setTimeout(() => {
      showAlert(
        '🏛️ Bienvenue au Village Éducatif Gaulois !<br>Ici, nous résistons aux Big Tech avec style !',
        'welcome'
      );
    }, 1000);

    // Random roman alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        showRomanAlert();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentStudent]);

  const changeStudent = (studentId) => {
    setCurrentStudent(studentId);
    showAlert(`✨ ${studentsData[studentId].name} est maintenant sélectionné !`, 'info');
  };

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    const newAlert = { id, message, type };
    setAlerts(prev => [...prev, newAlert]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const showRomanAlert = () => {
    const romanAlerts = [
      '⚔️ ALERTE ROMAINE ! Les légions de Google Classroom approchent !',
      '🛡️ ATTENTION ! Microsoft Teams tente d\'envahir notre village !',
      '🚨 URGENCE ! Facebook veut cartographier notre forêt numérique !',
      '⚠️ DANGER ! Amazon livre des menhirs logiciels !'
    ];
    
    const message = romanAlerts[Math.floor(Math.random() * romanAlerts.length)];
    showAlert(message, 'roman');
  };

  const exportEvaluation = () => {
    showAlert('📊 Exportation des données vers Excel...<br><small>Les Romains ne pourront pas les lire !</small>', 'info');
  };

  const generateReport = () => {
    showAlert('📄 Génération du rapport PDF...<br><small>Avec encre de chêne et parchemin numérique !</small>', 'info');
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="app">
      {/* Décorations flottantes */}
      <div className="gaulois-decoration decoration-1">⚔️</div>
      <div className="gaulois-decoration decoration-2">🏺</div>
      <div className="gaulois-decoration decoration-3">🛡️</div>
      <div className="gaulois-decoration decoration-4">🌳</div>
      
      {/* Effets de brillance */}
      <div className="glow" style={{ top: '10%', left: '20%' }}></div>
      <div className="glow" style={{ top: '60%', right: '15%', animationDelay: '2s' }}></div>
      <div className="glow" style={{ bottom: '20%', left: '30%', animationDelay: '4s' }}></div>
      
      <div className="container">
        <Header />
        
        <StudentSelector 
          student={student}
          currentStudent={currentStudent}
          onChangeStudent={changeStudent}
        />
        
        <DefenseSystem />
        
        <StatsGrid student={student} />
        
        <Dashboard 
          student={student}
          currentStudent={currentStudent}
          onExport={exportEvaluation}
          onGenerateReport={generateReport}
          onShowRomanAlert={showRomanAlert}
        />
      </div>

      <Alert alerts={alerts} onRemove={removeAlert} />
    </div>
  );
}

export default App;