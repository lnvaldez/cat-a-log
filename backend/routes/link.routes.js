const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  getAllLinks,
  createLink,
  updateLink,
  deleteLink,
} = require("../controllers/link.controller");

const router = express.Router();

router.get("/", getAllLinks);
router.post("/", protect, createLink);
router.put("/:id", protect, updateLink);
router.delete("/:id", protect, deleteLink);

module.exports = router;
