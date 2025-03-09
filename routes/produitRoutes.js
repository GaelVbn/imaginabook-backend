import express from "express";
import {
  createProduit,
  getProduits,
  getFichierPDF,
  getCategories,
  getProduitsByCategorie,
  getProduitByToken,
} from "../controllers/produitController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route pour créer un nouveau produit
router.post("/produits", createProduit);

// Route pour obtenir tous les produits
router.get("/produits", getProduits);

// Rout pour obtenir un produit par son token envoyé dans le header
router.get("/produit", verifyToken, getProduitByToken);

// Route pour récupérer le fichier PDF d'un produit
router.get("/produits/fichierPDF", verifyToken, getFichierPDF);

router.get("/categories", getCategories);

// Route pour récupérer les produits d'une catégorie spécifique
router.get("/produits/categorie/:nomCategorie", getProduitsByCategorie);

export default router;
