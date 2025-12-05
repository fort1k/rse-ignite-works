import { useState } from "react";
import "../styles/evaluation.css";

export default function Evaluation() {
  const [formData, setFormData] = useState({
    id_etudiant: "",
    performance_academique: "",
    participation_classe: "",
    comportement: "",
    respect_ethique: "",
    integration_sociale: "",
    responsabilite_environnementale: "",
    communication: "",
    commentaire: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Envoi des données :", formData);
    alert("Évaluation envoyée (simulation) !");
    // Ici tu pourras faire fetch() vers PHP pour enregistrer
  };

  return (
    <div className="eval-wrapper">
      <h1>Évaluation de l'élève</h1>
      <form onSubmit={handleSubmit}>
        <label>ID Étudiant</label>
        <input
          type="number"
          name="id_etudiant"
          value={formData.id_etudiant}
          onChange={handleChange}
          required
        />

        <label>Performance académique (0-10)</label>
        <input
          type="number"
          name="performance_academique"
          min="0"
          max="10"
          value={formData.performance_academique}
          onChange={handleChange}
          required
        />

        <label>Participation en classe (0-10)</label>
        <input
          type="number"
          name="participation_classe"
          min="0"
          max="10"
          value={formData.participation_classe}
          onChange={handleChange}
          required
        />

        <label>Comportement (0-10)</label>
        <input
          type="number"
          name="comportement"
          min="0"
          max="10"
          value={formData.comportement}
          onChange={handleChange}
          required
        />

        <label>Respect & Éthique (0-10)</label>
        <input
          type="number"
          name="respect_ethique"
          min="0"
          max="10"
          value={formData.respect_ethique}
          onChange={handleChange}
          required
        />

        <label>Intégration sociale (0-10)</label>
        <input
          type="number"
          name="integration_sociale"
          min="0"
          max="10"
          value={formData.integration_sociale}
          onChange={handleChange}
          required
        />

        <label>Responsabilité environnementale (0-10)</label>
        <input
          type="number"
          name="responsabilite_environnementale"
          min="0"
          max="10"
          value={formData.responsabilite_environnementale}
          onChange={handleChange}
          required
        />

        <label>Communication (0-10)</label>
        <input
          type="number"
          name="communication"
          min="0"
          max="10"
          value={formData.communication}
          onChange={handleChange}
          required
        />

        <label>Commentaire</label>
        <textarea
          name="commentaire"
          value={formData.commentaire}
          onChange={handleChange}
        />

        <button type="submit">Envoyer l'évaluation</button>
      </form>
    </div>
  );
}
