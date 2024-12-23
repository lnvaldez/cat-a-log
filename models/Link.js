const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  votes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Link", linkSchema);
