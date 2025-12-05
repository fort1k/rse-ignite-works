import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <div className="header fade-in-up">
      <h1>🏛️ VILLAGE ÉDUCATIF GAULOIS</h1>
      <p>Où la résistance numérique rencontre l'excellence académique !</p>
      <p><em>« Ils sont fous ces Romains... de nos résultats ! »</em></p>
      <div className="header-tag">
        🛡️ 100% Libre - 0% Big Tech 🛡️
      </div>
    </div>
  );
}

export default Header;