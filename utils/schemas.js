const mongoose = require("mongoose");

const User = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  xp: { type: Number, default: 1 },
  xpPoint: { type: Number, default: 1 },
  tasks: {
    type: {
      isActive: { type: Boolean, default: false },
      title: { type: String, default: null },
      taskId: { type: String, default: null },
      deadline: { type: Date, default: null },
      createdAt: { type: Date, default: null },
      prize: { type: Number, default: null },
    },
    default: null,
  },
  complatedTasks: { type: Array, default: [] },
  gerekli: { type: Number, default: 20000 },
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
