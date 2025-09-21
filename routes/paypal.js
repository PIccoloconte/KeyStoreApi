import express from "express";
import { createPayPalPayment, capturePayment } from "../controllers/paypal.js";

const router = express.Router();

router.post("/", createPayPalPayment);
router.get("/capturePayment/:paymentId", capturePayment);

export default router;
