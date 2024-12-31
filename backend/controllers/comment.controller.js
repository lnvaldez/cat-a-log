const { Comment } = require("../models");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ linkId: req.params.linkId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      linkId: req.body.linkId,
      content: req.body.content,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getComments,
  createComment,
};
