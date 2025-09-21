import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    platform: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Validazione semplice URL
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} non è un URL valido!`,
      },
    },
    images: [
      {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^(http|https):\/\/[^ "]+$/.test(v);
          },
          message: (props) => `${props.value} non è un URL valido!`,
        },
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    keys: [
      {
        type: String,
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model("Game", gameSchema);
