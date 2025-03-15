import nodemailer from "nodemailer";
import Produit from "../models/Produit.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// export const sendConfirmationEmail = async (req, res) => {
//   try {
//     const { sessionId, email } = req.body;

//     console.log(" La route /send-email a t appel e.");
//     console.log(" Session ID:", sessionId);
//     console.log(" Email  envoyer:", email);

//     if (!sessionId || !email) {
//       return res.status(400).json({ error: "Session ID et email requis." });
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false, //  viter certaines erreurs SSL
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Confirmation de paiement",
//       html: `
//         <h2>Merci pour votre achat !</h2>
//         <p>Votre paiement a bien t  re u.</p>
//         <p>Num ro de transaction : <strong>${sessionId}</strong></p>
//         <p>Nous vous remercions pour votre confiance.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.json({ success: "Email de confirmation envoy !" });
//   } catch (error) {
//     console.error(" Erreur lors de l'envoi de l'email:", error);
//     res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
//   }
// };

/*export const sendConfirmationEmail = async (req, res) => {
  try {
    const { sessionId, email, tokens } = req.body; // Récupère les tokens dans le body de la requête

    console.log(" La route /send-email a ete appelee.");
    console.log(" Session ID:", sessionId);
    console.log(" Email envoyer:", email);
    console.log(" Tokens:", tokens);

    if (!sessionId || !email) {
      return res.status(400).json({ error: "Session ID et email requis." });
    }

    // Créer le transporteur pour l'envoi d'email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, //  viter certaines erreurs SSL
      },
    });

    // Préparer l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation achat",
      html: `
        <h2>Merci pour votre achat !</h2>
        <p>Votre paiement a bien ete recu.</p>
        <p>Numero de transaction : <strong>${sessionId}</strong></p>
        <p>Nous vous remercions pour votre confiance.</p>
      `,
      attachments: [], // Initialisation d'un tableau vide pour les pièces jointes
    };

    if (tokens && tokens.length > 0) {
      // Récupérer et ajouter les fichiers PDF pour chaque token
      for (const token of tokens) {
        const produit = await Produit.findOne({ token }); // Recherche du produit par le token

        if (!produit || !produit.fichierPDF) {
          console.log(
            `Produit avec token ${token} non trouve ou sans fichier PDF.`
          );
          continue; // Si le produit n'a pas de fichier PDF, on continue avec les autres tokens
        }

        // Ajouter le fichier PDF   la liste des pi ces jointes
        mailOptions.attachments.push({
          filename: `${produit.titre}.pdf`, // Le nom du fichier PDF, tu peux le personnaliser
          content: produit.fichierPDF, // Le contenu du fichier PDF
          encoding: "base64", // S'assurer que le contenu est encod  correctement
        });
      }
    }

    // Envoyer l'email avec les pi ces jointes
    await transporter.sendMail(mailOptions);

    // R ponse de succ s
    res.json({
      success: "Email de confirmation envoye !",
    });
  } catch (error) {
    console.error(" Erreur lors de l'envoi de l'email:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
  }
}; */

export const sendConfirmationEmail = async (req, res) => {
  try {
    const { sessionId, email, tokens } = req.body; // Récupère les tokens dans le body de la requête

    // console.log("La route /send-email a été appelée.");
    // console.log("Session ID:", sessionId);
    // console.log("Email envoyé:", email);
    // console.log("Tokens:", tokens);

    if (!sessionId || !email) {
      return res.status(400).json({ error: "Session ID et email requis." });
    }

    // Générer un token JWT pour la page d'avis, valide pendant 24h
    const reviewToken = jwt.sign(
      { email, sessionId }, // Payload, inclut l'email et le sessionId pour la vérification
      process.env.JWT_SECRET, // Clé secrète pour signer le token
      { expiresIn: "24h" } // Expiration du token dans 24 heures
    );

    // Créer le transporteur pour l'envoi d'email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Vider certaines erreurs SSL
      },
    });

    // Préparer l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation achat",
      html: `
        <h2>Merci pour votre achat !</h2>
        <p>Votre paiement a bien été reçu.</p>
        <p>Numéro de transaction : <strong>${sessionId}</strong></p>
        <p>Nous vous remercions pour votre confiance.</p>
        <p>Nous vous invitons à donner votre avis sur votre achat en cliquant sur le lien ci-dessous :</p>
        <p><a href="https://www.imaginabook.com/reviewFormPage?tokenReview=${reviewToken}">Donner mon avis</a></p>
        <p>Le lien expirera dans 24 heures.</p>
      `,
      attachments: [], // Initialisation d'un tableau vide pour les pièces jointes
    };

    if (tokens && tokens.length > 0) {
      // Récupérer et ajouter les fichiers PDF pour chaque token
      for (const token of tokens) {
        const produit = await Produit.findOne({ token }); // Recherche du produit par le token

        if (!produit || !produit.fichierPDF) {
          console.log(
            `Produit avec token ${token} non trouvé ou sans fichier PDF.`
          );
          continue; // Si le produit n'a pas de fichier PDF, on continue avec les autres tokens
        }

        // Ajouter le fichier PDF à la liste des pièces jointes
        mailOptions.attachments.push({
          filename: `${produit.titre}.pdf`, // Le nom du fichier PDF, tu peux le personnaliser
          content: produit.fichierPDF, // Le contenu du fichier PDF
          encoding: "base64", // S'assurer que le contenu est encodé correctement
        });
      }
    }

    // Envoyer l'email avec les pièces jointes
    await transporter.sendMail(mailOptions);

    // Réponse de succès
    res.json({
      success: "Email de confirmation envoyé !",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
  }
};

export const validateReviewToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    return res.status(401).json({ message: "Token invalide", error });
  }
};
