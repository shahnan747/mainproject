const express = require("express");
const router = express.Router();
const {
  generateOrderSuggestion,
  getPaymentDelayAnalytics,
  getAIHistory,
} = require("../controllers/aiController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

// AI Order Suggestion
router.post("/generate", authorize("admin", "field_agent"), generateOrderSuggestion);

// AI History for a store
router.get("/history/:storeId", getAIHistory);

// Payment Delay Analytics
router.get("/analytics/payment-delays", authorize("admin"), getPaymentDelayAnalytics);

module.exports = router;
