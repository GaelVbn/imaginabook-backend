import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import produitRoutes from "../routes/produitRoutes.js";
import contactRoutes from "../controllers/contactController.js";
import emailRoutes from "../routes/emailRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import cors from "cors";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// ---------------------------
// Connexion MongoDB persistante
// ---------------------------
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ---------------------------
// Routes
// ---------------------------
app.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    res.send("<h1>Bienvenue sur l'API Imaginabook 🚀</h1>");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur de connexion à MongoDB");
  }
});

app.use("/api", produitRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/review", reviewRoutes);

// ---------------------------
// Export serverless
// ---------------------------
export default serverless(app);
