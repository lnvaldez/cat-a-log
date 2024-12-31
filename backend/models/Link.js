const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
