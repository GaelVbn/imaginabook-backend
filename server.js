// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

// Import des routes
import produitRoutes from "./routes/produitRoutes.js";
import contactRoutes from "./controllers/contactController.js";
import emailRoutes from "./routes/emailRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));

// Routes
app.use("/api", produitRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/review", reviewRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("<h1>Bienvenue sur l'API Imaginabook 🚀</h1>");
});

// Démarrer le serveur sur Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
