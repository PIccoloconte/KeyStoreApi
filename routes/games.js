import express from "express";
import { authenticate, isAdmin } from "../middlewares/auth.js";
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "../controllers/games.js";

const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/", authenticate, isAdmin, createGame);
router.patch("/:id", authenticate, isAdmin, updateGame);
router.delete("/:id", authenticate, isAdmin, deleteGame);

export default router;
