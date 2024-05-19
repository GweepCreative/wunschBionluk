const mongoose = require("mongoose");

const Task = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, default: "" },
    prize: { type: Number, default: 0 },
    deadline: { type: String, default: null },
});

module.exports = mongoose.model("Task", Task);