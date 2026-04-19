const express = require("express");
const router = express.Router();
const {
  getAllCommunityPosts,
  deleteCommunityPost,
} = require("../controllers/managementCommunityController");

router.get("/", getAllCommunityPosts);
router.delete("/:id", deleteCommunityPost);

module.exports = router;