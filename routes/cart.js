import express from "express";
import {
  getCart,
  addToCart,
  deleteGameFromCart,
  clearCart,
} from "../controllers/cart.js";

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:gameId", deleteGameFromCart);
router.delete("/", clearCart);

export default router;
