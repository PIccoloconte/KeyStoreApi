import { User } from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;

  //cerco tramite il mio user la password hashata
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "Utente/password non trovata" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET
    );
    return res.json({ status: "ok", data: token, user: user });
  }
};

export const register = async (req, res) => {
  const { username, password, confirmPassword, email, role } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Username non valido" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Password non valida" });
  }
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "La password deve essere di almeno 6 caratteri" });
  }

  if (!confirmPassword || password !== confirmPassword) {
    return res.status(400).json({ message: "Le password non coincidono" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: username,
    password: hashedPassword,
    email: email,
    role: role,
  });

  try {
    await user.save();
    res
      .status(201)
      .json({ status: "ok", message: "Utente registrato con successo" });
  } catch (error) {
    res
      .status(409)
      .json({ status: "error", message: "Errore durante la registrazione" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Esclude la password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero utenti" });
  }
};
