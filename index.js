import express from "express";
import gameRoutes from "./routes/games.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/paypal.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authenticate } from "./middlewares/auth.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: true, // more permissive than a specific list, but more secure than wildcard
    credentials: true,
    optionsSuccessStatus: 200, // browser legacy support
  })
);

app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/cart", authenticate, cartRoutes);
app.use("/api/paypal", authenticate, paymentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      // {"0.0.0.0",} guarantee access from external IPs
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
