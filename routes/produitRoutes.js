import express from "express";
import {
  createProduit,
  getProduits,
  getFichierPDF,
} from "../controllers/produitController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route pour créer un nouveau produit
router.post("/produits", createProduit);

// Route pour obtenir tous les produits
router.get("/produits", getProduits);

// Route pour récupérer le fichier PDF d'un produit
router.get("/produits/fichierPDF", verifyToken, getFichierPDF);

export default router;
