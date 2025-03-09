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

// Obtenir uniquement le produit par son token
export const getProduitByToken = async (req, res) => {
  try {
    const produit = await Produit.findOne(
      { token: req.headers.authorization.split(" ")[1] },
      { _id: 0, fichierPDF: 0 }
    ).populate("categories");
    res.status(200).send(produit);
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

export const getCategories = async (req, res) => {
  try {
    // Trouver toutes les catégories dans la base de données
    const categories = await Categorie.find();

    // Si aucune catégorie n'est trouvée, on renvoie un message d'erreur
    if (!categories.length) {
      return res.status(404).send({ error: "Aucune catégorie trouvée." });
    }

    // Renvoie les catégories au format JSON
    res.status(200).send(categories);
  } catch (err) {
    console.error("Erreur lors de la récupération des catégories :", err);
    res
      .status(500)
      .send({ error: "Erreur lors de la récupération des catégories." });
  }
};

// Récupérer les produits par catégorie
export const getProduitsByCategorie = async (req, res) => {
  try {
    const { nomCategorie } = req.params;

    // Vérifier si la catégorie existe
    const categorie = await Categorie.findOne({ nom: nomCategorie });

    if (!categorie) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    // Trouver tous les produits appartenant à cette catégorie en excluant "_id"
    const produits = await Produit.find({ categories: categorie._id })
      .populate("categories")
      .select("-_id -fichierPDF"); // Exclut "_id" et "fichierPDF" de la réponse

    res.status(200).json(produits);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des produits par catégorie :",
      err
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};
