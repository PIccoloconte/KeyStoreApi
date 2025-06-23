import express from "express";
import { login, register, getAllUsers } from "../controllers/auth.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// POST /register
// Body: { username, password, email, role }
router.post("/register", register);

// POST /login
// Body: { username, password }
router.post("/login", login);

// GET /users - Solo admin
router.get("/users", authenticate, isAdmin, getAllUsers);

export default router;
