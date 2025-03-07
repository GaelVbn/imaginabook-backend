import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import produitRoutes from "./routes/produitRoutes.js";
import contactRoutes from "./controllers/contactController.js";
import cors from "cors";

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const port = process.env.PORT || 3005;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Autoriser les requêtes CORS
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
  });

// Utiliser les routes des produits
app.use("/api", produitRoutes);

app.use("/api/contact", contactRoutes);

// Route pour tester la connexion
app.get("/", (req, res) => {
  res.send("Serveur Node.js en cours d'exécution");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
