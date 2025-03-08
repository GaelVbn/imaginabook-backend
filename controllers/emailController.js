import nodemailer from "nodemailer";
import Produit from "../models/Produit.js";
import dotenv from "dotenv";

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

export const sendConfirmationEmail = async (req, res) => {
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
};
