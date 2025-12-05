import "../styles/signin.css";

export default function Signin() {
  return (
    <div className="signin-wrapper">
      <div className="container">
        <div className="logo">EduEval+</div>

        <h1>Inscription Professeur</h1>

        <form id="registerForm">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" type="text" required />

          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" type="text" required />

          <label htmlFor="carteId">Numéro de carte d'identité</label>
          <input
            id="carteId"
            name="carteId"
            type="text"
            pattern="[0-9]{8,20}"
            placeholder="8 à 20 chiffres"
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" minLength="6" required />

          <button type="submit">Connexion</button>
        </form>

        <p id="message"></p>
      </div>

      <div className="right-content">
        <strong>Notez vos élèves facilement et rapidement</strong>

        EduEval+ vous permet uniquement de :
        <ul>
          <li>Entrer les notes et évaluations de manière intuitive</li>
          <li>Suivre la progression individuelle des élèves</li>
          <li>Exporter et partager les résultats en un clic</li>
        </ul>

        <p
          style={{
            fontSize: "17px",
            color: "#a0c8ff",
            marginTop: "30px",
            fontStyle: "italic",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "20px",
            fontWeight: 500,
          }}
        >
          Simplifiez votre gestion pédagogique au quotidien
        </p>
      </div>
    </div>
  );
}
