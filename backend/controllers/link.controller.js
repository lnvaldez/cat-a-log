const { Link } = require("../models");

const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().populate("createdBy", "username");
    res.json(links);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createLink = async (req, res) => {
  try {
    const link = await Link.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateLink = async (req, res) => {
  try {
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const voteLink = async (req, res) => {
  try {
    const { vote } = req.body; // should be 1 or -1
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: vote } },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllLinks,
  createLink,
  updateLink,
  deleteLink,
  voteLink,
};
