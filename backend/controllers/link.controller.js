const { Link } = require("../models");

const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createLink = async (req, res) => {
  try {
    const link = await Link.create(req.body);
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
    const link = await Link.findByIdAndDelete(req.params.id);
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
  getLink,
  createLink,
  updateLink,
  deleteLink,
  voteLink,
};
