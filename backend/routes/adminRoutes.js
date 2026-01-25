const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);

// protected test route
router.get("/test", authMiddleware, (req, res) => {
  res.json({ message: "Admin protected route working" });
});

module.exports = router;
