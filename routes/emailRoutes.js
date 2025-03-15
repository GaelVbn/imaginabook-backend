import express from "express";
import {
  sendConfirmationEmail,
  validateReviewToken,
} from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-email", sendConfirmationEmail);
router.get("/validate-token", validateReviewToken);

export default router;
