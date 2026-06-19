const Order = require("../models/Order");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    let query = {};

    // Field agents only see their own orders
    if (req.user.role === "field_agent") {
      query.fieldAgentId = req.user._id;
    }

    // Delivery personnel only see assigned orders
    if (req.user.role === "delivery_personnel") {
      query.assignedDeliveryPersonnel = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("storeId", "name location route")
      .populate("fieldAgentId", "name email")
      .populate("assignedDeliveryPersonnel", "name email")
      .populate("items.productId", "name price unit")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("storeId", "name location route contact")
      .populate("fieldAgentId", "name email")
      .populate("assignedDeliveryPersonnel", "name email")
      .populate("items.productId", "name price unit");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Field Agent)
const createOrder = async (req, res, next) => {
  try {
    req.body.fieldAgentId = req.user._id;

    const order = await Order.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (workflow)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["collected", "assigned", "loaded", "delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: `Order status updated to '${status}'`, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign order to delivery personnel
// @route   PUT /api/orders/:id/assign
// @access  Private (Admin)
const assignOrder = async (req, res, next) => {
  try {
    const { deliveryPersonnelId } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        assignedDeliveryPersonnel: deliveryPersonnelId,
        status: "assigned",
      },
      { new: true }
    ).populate("assignedDeliveryPersonnel", "name email");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order assigned successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  assignOrder,
  deleteOrder,
};
