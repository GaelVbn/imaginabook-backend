import mongoose from "mongoose";

const produitSchema = new mongoose.Schema({
  token: { type: String },
  titre: String,
  description: String,
  format: [String],
  quantite: Number,
  categories: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie" },
  prix_pdf: Number,
  prix_physique: Number,
  note_globale: Number,
  imagesPDF: [String],
  imagePhysique: [String],
  fichierPDF: Buffer,
  avis: [
    {
      note: Number,
      commentaire: String,
      email: String,
    },
  ],
});

const Produit = mongoose.model("Produit", produitSchema);

export default Produit;
