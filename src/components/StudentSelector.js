import React from 'react';
import { studentsData } from '../utils/chartData';
import './StudentSelector.css';

function StudentSelector({ student, currentStudent, onChangeStudent }) {
  const handleStudentChange = (e) => {
    onChangeStudent(e.target.value);
  };

  return (
    <div className="student-selector fade-in-up">
      <div className="student-avatar" id="student-avatar">
        {student.avatar}
      </div>
      <div className="student-info">
        <h2 id="student-name">{student.name}</h2>
        <div className="student-class" id="student-class">
          {student.class}
        </div>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <select 
          id="student-select" 
          onChange={handleStudentChange}
          value={currentStudent}
          className="student-select"
        >
          <option value="asterix">Astérix le Brillant</option>
          <option value="obelix">Obélix le Fort</option>
          <option value="panoramix">Panoramix le Sage</option>
          <option value="idefix">Idéfix le Fidèle</option>
        </select>
      </div>
    </div>
  );
}

export default StudentSelector;