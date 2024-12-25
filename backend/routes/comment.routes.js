const express = require("express");
const {
  createComment,
  getCommentsByLink,
} = require("../controllers/comment.controller");

const router = express.Router();

router.post("/:linkId", createComment);
router.get("/:linkId", getCommentsByLink);

module.exports = router;
