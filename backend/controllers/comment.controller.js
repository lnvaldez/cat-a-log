const { Comment } = require("../models");

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      link: req.params.linkId,
      createdBy: req.user._id,
    });

    const populatedComment = await comment.populate("createdBy", "username");
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCommentsByLink = async (req, res) => {
  try {
    const comments = await Comment.find({ link: req.params.linkId })
      .populate("createdBy", "username")
      .sort("-createdAt");
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createComment, getCommentsByLink };
