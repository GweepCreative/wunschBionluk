const mongoose = require("mongoose");

const Cark = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, default: "" },
    balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cark", Cark);