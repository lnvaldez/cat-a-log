const mongoose = require("mognoose");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    link: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
