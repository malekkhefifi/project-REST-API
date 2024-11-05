// Importer Express
const express = require('express');
const app = express(); // Initialiser l'application Express

// Définir un port pour le serveur
//const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Définir une route de base (facultative)
app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur Express');
});

// Démarrer le serveur
/*app.listen(PORT, () => {
    console.log(`le serveur Express est en cours d'exécution sur le port ${PORT}`)
});*/
/*********************************************** */
//Importer mongoose en premier !
const mongoose = require('mongoose');

// URL de connexion locale
const url = 'mongodb://localhost:27017/maBaseDeDonnees';

// Connexion à MongoDB
mongoose.connect(url)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.log('Erreur de connexion:', err));

/***********************************************************/




app.use(express.json());

// Définir le schéma et le modèle des utilisateurs
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model('User', userSchema);

// Route GET : Retourner tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route POST : Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route PUT : Éditer un utilisateur par ID
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route DELETE : Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`le serveur Express est en cours d'exécution sur le port ${PORT}`);
});