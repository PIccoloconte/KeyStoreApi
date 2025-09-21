import { Order } from "../models/orders.js";
import { Game } from "../models/games.js";
import { Cart } from "../models/cart.js";

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

// Create order from cart items
export const createOrder = async (req, res) => {
  try {
    // Trova il carrello dell'utente
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.gameId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Carrello vuoto" });
    }

    const orders = [];

    // Crea un ordine per ogni item nel carrello
    for (const item of cart.items) {
      const game = await Game.findById(item.gameId._id);

      if (!game) {
        return res
          .status(404)
          .json({ message: `Game ${item.gameId._id} not found` });
      }

      // Verifica che ci siano abbastanza chiavi riservate
      if (
        !item.reservedKeys ||
        item.reservedKeys.length < (item.quantity || 1)
      ) {
        return res.status(400).json({
          message: `Not enough reserved keys for ${game.title}`,
        });
      }

      // Per ogni quantità nel carrello, crea un ordine separato usando le chiavi riservate
      for (let i = 0; i < (item.quantity || 1); i++) {
        const keyAssigned = item.reservedKeys[i];

        const newOrder = new Order({
          userId: req.user.id,
          gameId: game._id,
          keyAssigned: keyAssigned,
          pricePaid: item.price,
          title: item.title,
          imageUrl: item.imageUrl,
        });

        await newOrder.save();
        orders.push(newOrder);
      }
    }

    // Svuota il carrello dopo aver completato gli ordini
    // Le chiavi sono già state trasferite agli ordini, non c'è bisogno di ripristinarle
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Orders created successfully",
      orders: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
