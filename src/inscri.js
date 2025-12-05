// server.js - Backend complet pour EduEval+
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edueval', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', () => {
    console.log('Connecté à MongoDB');
});

// Schémas Mongoose
const ProfesseurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    carteId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    dateInscription: { type: Date, default: Date.now }
});

const EleveSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    classe: { type: String, required: true },
    professeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professeur', required: true }
});

const NoteSchema = new mongoose.Schema({
    eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
    professeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professeur', required: true },
    matiere: { type: String, required: true },
    typeEvaluation: { type: String, required: true },
    note: { type: Number, required: true, min: 0, max: 20 },
    coefficient: { type: Number, default: 1 },
    dateEvaluation: { type: Date, default: Date.now },
    commentaire: String
});

const ClasseSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    professeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professeur', required: true },
    eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }]
});

// Modèles
const Professeur = mongoose.model('Professeur', ProfesseurSchema);
const Eleve = mongoose.model('Eleve', EleveSchema);
const Note = mongoose.model('Note', NoteSchema);
const Classe = mongoose.model('Classe', ClasseSchema);

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token d\'authentification requis' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt', (err, professeur) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.professeur = professeur;
        next();
    });
};

// Routes d'authentification
app.post('/api/register', async (req, res) => {
    try {
        const { nom, prenom, carteId, password } = req.body;

        // Validation
        if (!nom || !prenom || !carteId || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        // Vérifier si le professeur existe déjà
        const existingProfesseur = await Professeur.findOne({ carteId });
        if (existingProfesseur) {
            return res.status(400).json({ error: 'Un professeur avec cette carte d\'identité existe déjà' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le professeur
        const professeur = new Professeur({
            nom,
            prenom,
            carteId,
            password: hashedPassword
        });

        await professeur.save();

        // Générer un token JWT
        const token = jwt.sign(
            { id: professeur._id, nom: professeur.nom, prenom: professeur.prenom },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Compte créé avec succès',
            token,
            professeur: {
                id: professeur._id,
                nom: professeur.nom,
                prenom: professeur.prenom,
                carteId: professeur.carteId
            }
        });

    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { carteId, password } = req.body;

        // Validation
        if (!carteId || !password) {
            return res.status(400).json({ error: 'Carte ID et mot de passe requis' });
        }

        // Trouver le professeur
        const professeur = await Professeur.findOne({ carteId });
        if (!professeur) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, professeur.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: professeur._id, nom: professeur.nom, prenom: professeur.prenom },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            professeur: {
                id: professeur._id,
                nom: professeur.nom,
                prenom: professeur.prenom,
                carteId: professeur.carteId
            }
        });

    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
});

// Routes protégées - Gestion des élèves
app.post('/api/eleves', authenticateToken, async (req, res) => {
    try {
        const { nom, prenom, classe } = req.body;

        if (!nom || !prenom || !classe) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const eleve = new Eleve({
            nom,
            prenom,
            classe,
            professeurId: req.professeur.id
        });

        await eleve.save();

        res.status(201).json({
            message: 'Élève ajouté avec succès',
            eleve
        });

    } catch (error) {
        console.error('Erreur ajout élève:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/eleves', authenticateToken, async (req, res) => {
    try {
        const eleves = await Eleve.find({ professeurId: req.professeur.id });
        res.json(eleves);
    } catch (error) {
        console.error('Erreur récupération élèves:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Routes pour les notes
app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const { eleveId, matiere, typeEvaluation, note, coefficient, commentaire } = req.body;

        if (!eleveId || !matiere || !typeEvaluation || note === undefined) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        if (note < 0 || note > 20) {
            return res.status(400).json({ error: 'La note doit être entre 0 et 20' });
        }

        const nouvelleNote = new Note({
            eleveId,
            professeurId: req.professeur.id,
            matiere,
            typeEvaluation,
            note: parseFloat(note),
            coefficient: coefficient || 1,
            commentaire
        });

        await nouvelleNote.save();

        res.status(201).json({
            message: 'Note ajoutée avec succès',
            note: nouvelleNote
        });

    } catch (error) {
        console.error('Erreur ajout note:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/notes/eleve/:eleveId', authenticateToken, async (req, res) => {
    try {
        const { eleveId } = req.params;
        const notes = await Note.find({ 
            eleveId, 
            professeurId: req.professeur.id 
        }).populate('eleveId', 'nom prenom');
        
        res.json(notes);
    } catch (error) {
        console.error('Erreur récupération notes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/notes/matiere/:matiere', authenticateToken, async (req, res) => {
    try {
        const { matiere } = req.params;
        const notes = await Note.find({ 
            matiere, 
            professeurId: req.professeur.id 
        }).populate('eleveId', 'nom prenom');
        
        res.json(notes);
    } catch (error) {
        console.error('Erreur récupération notes par matière:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Statistiques
app.get('/api/statistiques', authenticateToken, async (req, res) => {
    try {
        const professeurId = req.professeur.id;

        // Nombre total d'élèves
        const totalEleves = await Eleve.countDocuments({ professeurId });

        // Nombre total de notes
        const totalNotes = await Note.countDocuments({ professeurId });

        // Moyenne générale des notes
        const notes = await Note.find({ professeurId });
        const moyenneGenerale = notes.length > 0 
            ? notes.reduce((sum, note) => sum + note.note, 0) / notes.length 
            : 0;

        // Répartition par matière
        const matieres = await Note.aggregate([
            { $match: { professeurId: mongoose.Types.ObjectId(professeurId) } },
            { $group: { 
                _id: '$matiere', 
                count: { $sum: 1 },
                moyenne: { $avg: '$note' }
            }},
            { $sort: { _id: 1 } }
        ]);

        // Dernières notes ajoutées
        const dernieresNotes = await Note.find({ professeurId })
            .populate('eleveId', 'nom prenom')
            .sort({ dateEvaluation: -1 })
            .limit(5);

        res.json({
            totalEleves,
            totalNotes,
            moyenneGenerale: moyenneGenerale.toFixed(2),
            matieres,
            dernieresNotes
        });

    } catch (error) {
        console.error('Erreur statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Export des données
app.get('/api/export/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ professeurId: req.professeur.id })
            .populate('eleveId', 'nom prenom classe')
            .sort({ dateEvaluation: -1 });

        // Format CSV
        const csvHeader = 'Élève,Classe,Matière,Type d\'évaluation,Note,Coefficient,Date,Commentaire\n';
        const csvRows = notes.map(note => {
            const eleve = note.eleveId;
            const date = new Date(note.dateEvaluation).toLocaleDateString('fr-FR');
            return `"${eleve.prenom} ${eleve.nom}","${eleve.classe}","${note.matiere}","${note.typeEvaluation}",${note.note},${note.coefficient},${date},"${note.commentaire || ''}"`;
        }).join('\n');

        const csv = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=notes-edueval.csv');
        res.send(csv);

    } catch (error) {
        console.error('Erreur export:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour vérifier le token (garder la session active)
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, professeur: req.professeur });
});

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Serveur EduEval+ en ligne' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur EduEval+ démarré sur le port ${PORT}`);
    console.log(`API disponible sur http://localhost:${PORT}/api`);
});

// Script de démarrage pour package.json
/*
{
  "name": "edueval-plus",
  "version": "1.0.0",
  "description": "Application de gestion des notes pour professeurs",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
