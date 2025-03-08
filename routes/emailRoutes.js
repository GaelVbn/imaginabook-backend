import express from "express";
import { sendConfirmationEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-email", sendConfirmationEmail);

export default router;
