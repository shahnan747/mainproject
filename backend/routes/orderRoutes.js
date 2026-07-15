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

router.put("/assign", authorize("admin"), assignOrder);

router.put("/:id/status", authorize("admin", "delivery_personnel"), updateOrderStatus);

router.route("/:id")
  .get(getOrder)
  .put(authorize("admin", "field_agent"), updateOrder)
  .delete(authorize("admin"), deleteOrder);



module.exports = router;
