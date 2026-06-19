const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  assignOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.route("/")
  .get(getOrders)
  .post(authorize("admin", "field_agent"), createOrder);

router.route("/:id")
  .get(getOrder)
  .put(authorize("admin", "field_agent"), updateOrder)
  .delete(authorize("admin"), deleteOrder);

router.put("/:id/status", updateOrderStatus);
router.put("/:id/assign", authorize("admin"), assignOrder);

module.exports = router;
