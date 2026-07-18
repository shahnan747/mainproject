const Order = require("../models/Order");

//Get all orders
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

//Get single order
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

//Create order

const createOrder = async (req, res, next) => {
  try {
    req.body.fieldAgentId = req.user._id;

    if (req.body.date && !req.body.orderDate) {
      req.body.orderDate = req.body.date;
      delete req.body.date;
    }

    const order = await Order.create(req.body);


    // Get Socket.io instance
    const io = req.app.get("io");

    // Notify all connected clients
    io.emit("newOrder", {
      message: "New order received",
      order,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Update order

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

// Update order status (workflow)
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

    const io = req.app.get("io");

    io.emit("statusUpdated", {
      orderId: order._id,
      status: order.status,
    });

    res.status(200).json({ success: true, message: `Order status updated to '${status}'`, data: order });
  } catch (error) {
    next(error);
  }
};

//Assign order to delivery personnel
const assignOrder = async (req, res, next) => {
  try {

    const { orderIds, deliveryPersonnelId, route } = req.body;

    const orders = await Order.updateMany(
      {
        _id: { $in: orderIds },
      },
      {
        $set: {
          assignedDeliveryPersonnel: deliveryPersonnelId,
          route,
          status: "assigned",
        },
      }
    );

    const io = req.app.get("io");

    io.emit("orderAssigned", {
      orderIds,
      deliveryPersonnelId,
      route,
    });

    res.status(200).json({
      success: true,
      message: "Orders assigned successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};


//  Delete order
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const io = req.app.get("io");

    io.emit("analyticsUpdated");

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//  Pending Payments
const getPendingPayments = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const pendingOrders = await Order.find({
      storeId,
      paymentStatus: "pending",
    }).sort({ orderDate: -1 });

    const totalPending = pendingOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      success: true,
      data: {
        totalPending,
        pendingOrders,
      },
    });
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
  getPendingPayments,
};
