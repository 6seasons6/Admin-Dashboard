const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/Todoplanner", authenticateToken, (req, res) => {
    if (req.user.email !== "info@6seasonsorganic.com") {
        return res.status(403).json({ message: "Access Denied" });
    }
    res.json({ message: "Welcome to TodoPlanners!" });
});

module.exports = router;