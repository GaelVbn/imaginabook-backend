import Produit from "../models/Produit.js";
import Categorie from "../models/Categorie.js";
import multer from "multer";
import jwt from "jsonwebtoken";

const upload = multer();

// Générer un token pour un produit
const generateToken = (produitId) => {
  const token = jwt.sign({ produitId }, process.env.SECRET_KEY);
  return token;
};

// Fonction pour vérifier et ajouter les catégories
async function ensureCategories(categoryNames) {
  const categories = [];
  for (const name of categoryNames) {
    let category = await Categorie.findOne({ nom: name });
    if (!category) {
      category = await Categorie.create({ nom: name });
    }
    categories.push(category._id);
  }
  return categories;
}

// Créer un nouveau produit
export const createProduit = [
  upload.single("fichierPDF"),
  async (req, res) => {
    try {
      // Vérifier et ajouter la catégorie
      const [category] = await ensureCategories([req.body.categories]);
      req.body.categories = category;

      // Ajouter les données du fichier au corps de la requête
      if (req.file) {
        req.body.fichierPDF = req.file.buffer;
      }

      const produit = new Produit(req.body);
      const token = generateToken(produit._id);

      produit.token = token;

      await produit.save(); // Sauvegarder le produit avec les informations
      res.status(201).send(produit); // Répondre avec le produit créé
    } catch (err) {
      console.error("Erreur générale :", err);
      res.status(400).send({ error: "Erreur lors de la création du produit." });
    }
  },
];

// Obtenir tous les produits avec leurs catégories
export const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find().populate("categories");
    res.status(200).send(produits);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Récupérer le fichier PDF d'un produit par titre
export const getFichierPDF = async (req, res) => {
  try {
    // Recherche du produit avec l'ID provenant du token
    const produit = await Produit.findById(req.produitId);

    // Vérifier si le produit existe et contient un fichier PDF
    if (!produit || !produit.fichierPDF) {
      return res
        .status(404)
        .send({ error: "Produit ou fichier PDF non trouvé." });
    }

    // Renvoyer le fichier PDF en réponse
    res.set("Content-Type", "application/pdf");
    res.send(produit.fichierPDF);
  } catch (err) {
    console.error("Erreur lors de la récupération du fichier PDF:", err);
    res
      .status(500)
      .send({ error: "Erreur lors de la récupération du fichier PDF." });
  }
};
