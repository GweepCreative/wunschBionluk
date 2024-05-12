const mongoose = require("mongoose");

const User = new mongoose.Schema({
  
  id: { type: String, unique: true, required: true },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  xp: { type: Number, default: 1 },
  xpPoint: { type: Number, default: 1 },
  gerekli: { type: Number, default: 2000 },
  products: { type: Array, default: [] },
  cooldowns: {
    work: { type: Date },
    beg: { type: Date },
    cash: { type: Date },
    daily: { type: Date },
    yazitura: { type: Date },
    blackjack: { type: Date },
  },
});

module.exports = { User: mongoose.model("User", User) };
