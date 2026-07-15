const express = require("express");
const router = express.Router();
const { register, login, getMe, forgotPassword, getDeliveryPersonnel } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.get("/me", protect, getMe);
router.get("/delivery-personnel",getDeliveryPersonnel);

module.exports = router;
