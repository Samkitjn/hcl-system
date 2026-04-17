const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
} = require("../controllers/communityController");

router.post("/post", createPost);
router.get("/posts", getAllPosts);

module.exports = router;