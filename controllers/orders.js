import { Order } from "../models/orders.js";
import { Game } from "../models/games.js";

// Get all orders for logged user
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("gameId");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    //game ID è l'unico paramentro che mi serve nel body per fare la richiesta
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: "gameId è obbligatorio" });
    }
    // Trova il gioco
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Controlla se ci sono key disponibili
    if (game.keys.length === 0) {
      return res
        .status(400)
        .json({ message: "No keys available for this game" });
    }

    // Estrai una key
    const keyAssigned = game.keys.pop();

    // Salva l'ordine
    const newOrder = new Order({
      userId: req.user.id, // grazie a authMiddleware
      gameId: game._id,
      keyAssigned: keyAssigned,
      pricePaid: game.price,
      title: game.title,
      imageUrl: game.imageUrl,
    });

    await newOrder.save();

    // Aggiorna il gioco senza la key appena usata
    await game.save();

    res.status(201).json({
      message: "Order created",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
