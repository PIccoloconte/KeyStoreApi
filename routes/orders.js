import express from "express";
import { getAllOrders, createOrder } from "../controllers/orders.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getAllOrders);
router.post("/:id", authenticate, createOrder);

export default router;
