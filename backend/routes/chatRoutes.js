const express = require ("express");
const router = express.Router();
const { chat } = require("../controllers/chatController.js");
const { protect } = require ("../middleware/auth.js");


router.post("/", protect, chat);

module.exports =  router;