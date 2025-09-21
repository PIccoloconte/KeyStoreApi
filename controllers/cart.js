import { Cart } from "../models/cart.js";
import { Game } from "../models/games.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.gameId"
    );
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { gameId, price, title, imageUrl, platform } = req.body;

  try {
    // Verifica che il gioco esista e abbia chiavi disponibili
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Verifica se ci sono chiavi disponibili
    if (game.keys.length === 0) {
      return res
        .status(400)
        .json({ message: "No keys available for this game" });
    }

    // Rimuovi una chiave dal gioco e riservala
    const reservedKey = game.keys.pop();
    await game.save();

    // Gestione carrello
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [
          {
            gameId,
            price,
            title,
            imageUrl,
            platform,
            quantity: 1,
            reservedKeys: [reservedKey],
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.gameId.toString() === gameId
      );

      if (itemIndex > -1) {
        // aggiorna quantità e aggiungi la chiave riservata
        cart.items[itemIndex].quantity += 1;
        cart.items[itemIndex].reservedKeys.push(reservedKey);
      } else {
        // aggiungi nuovo item
        cart.items.push({
          gameId,
          price,
          title,
          imageUrl,
          platform,
          quantity: 1,
          reservedKeys: [reservedKey],
        });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    // Recuperiamo il carrello popolato prima di inviarlo come risposta
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.gameId"
    );

    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGameFromCart = async (req, res) => {
  const { gameId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrello non trovato" });

    // Trova l'elemento del carrello da rimuovere
    const itemToRemove = cart.items.find(
      (item) => item.gameId.toString() === gameId
    );
    if (!itemToRemove) {
      return res
        .status(404)
        .json({ message: "Prodotto non trovato nel carrello" });
    }

    // Ripristina le chiavi riservate nel gioco
    const game = await Game.findById(gameId);
    if (game && itemToRemove.reservedKeys) {
      // Ripristina le chiavi specifiche che erano riservate
      game.keys.push(...itemToRemove.reservedKeys);
      await game.save();
    }

    // Rimuovi l'elemento dal carrello
    cart.items = cart.items.filter((item) => item.gameId.toString() !== gameId);
    cart.updatedAt = new Date();
    await cart.save();

    // Recuperiamo il carrello popolato prima di inviarlo come risposta
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.gameId"
    );

    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrello non trovato" });

    // Ripristina tutte le chiavi riservate per tutti gli elementi nel carrello
    for (const item of cart.items) {
      const game = await Game.findById(item.gameId);
      if (game && item.reservedKeys) {
        // Ripristina le chiavi specifiche che erano riservate
        game.keys.push(...item.reservedKeys);
        await game.save();
      }
    }

    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    // Recuperiamo il carrello popolato prima di inviarlo come risposta
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.gameId"
    );

    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
