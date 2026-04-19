const express = require("express");
const router = express.Router();
const {
  getAllCommunityPosts,
  createAnnouncement,
  deleteCommunityPost,
} = require("../controllers/managementCommunityController");

router.get("/", getAllCommunityPosts);
router.post("/announcement", createAnnouncement);
router.delete("/:id", deleteCommunityPost);

module.exports = router;