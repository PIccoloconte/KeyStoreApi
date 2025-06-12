import { Game } from "../models/games.js";
import mongoose from "mongoose";

// Ottieni tutti i giochi
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ottieni un gioco specifico
export const getGameById = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Gioco non trovato" });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crea un nuovo gioco
export const createGame = async (req, res) => {
  const game = new Game({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    platform: req.body.platform,
    imageUrl: req.body.imageUrl,
    available: req.body.available,
  });

  try {
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Aggiorna un gioco
export const updateGame = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID non valido" });
  }
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Gioco non trovato" });
    }

    Object.assign(game, req.body);
    const updatedGame = await game.save();
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Elimina un gioco
export const deleteGame = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID non valido" });
  }

  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Gioco non trovato" });
    }

    await Game.findByIdAndDelete(id);
    res.status(200).json({ message: "Gioco eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
