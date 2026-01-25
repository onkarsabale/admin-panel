const router = require("express").Router();
const { loginAdmin } = require("../controllers/adminAuthController");

router.post("/login", loginAdmin);

module.exports = router;
