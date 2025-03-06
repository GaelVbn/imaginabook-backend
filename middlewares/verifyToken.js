import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // Import jwt
dotenv.config();

// Middleware pour vérifier le token
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ error: "Aucun token fourni." });
  }

  // Vérifier le token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Token invalide ou expiré." });
    }
    req.produitId = decoded?.produitId; // On ajoute l'ID du produit dans la requête si il existe
    next();
  });
};
