const express = require("express");
const {
  getComments,
  createComment,
} = require("../controllers/comment.controller");

const router = express.Router();

router.get("/:linkId", getComments);
router.post("/", createComment);

module.exports = router;
