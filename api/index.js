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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));

app.use("/api", produitRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/review", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API Node.js déployée sur Vercel 🚀");
});

export default serverless(app);
