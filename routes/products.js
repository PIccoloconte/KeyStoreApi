import express from "express";
import {
  getAllProducts,
  getProductById,
  insertProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", insertProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct);

export default router;
