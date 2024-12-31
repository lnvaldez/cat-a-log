const express = require("express");
const {
  getAllLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  voteLink,
} = require("../controllers/link.controller");

const router = express.Router();

router.get("/", getAllLinks);
router.get("/:id", getLink);
router.post("/", createLink);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);
router.post("/:id/vote", voteLink);

module.exports = router;
