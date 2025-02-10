const express = require("express");
const { getLinkedInShares, getTwitterStats, getInstagramOverview, getFacebookLikes } = require("../controllers/socialController");

const router = express.Router();

router.get("/linkedin/shares", getLinkedInShares);
router.get("/twitter/stats", getTwitterStats);
router.get("/instagram/overview", getInstagramOverview);
router.get("/facebook/likes", getFacebookLikes);

module.exports = router;