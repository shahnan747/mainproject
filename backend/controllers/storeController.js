const Store = require("../models/Store");
const Order = require("../models/Order");

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
const getStores = async (req, res, next) => {
  try {
    const stores = await Store.find({ isActive: true });

    const storesWithPending = await Promise.all(
      stores.map(async (store) => {
        const pendingOrders = await Order.find({
          storeId: store._id,
          paymentStatus: "pending",
        });

        const totalPending = pendingOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        return {
          ...store.toObject(),
          pendingAmount: totalPending,
          pendingCount: pendingOrders.length,
        };
      })
    );

    res.json({
      success: true,
      count: stores.length,
      data: storesWithPending,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Private
const getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};

// @desc    Create store
// @route   POST /api/stores
// @access  Private (Admin)
const createStore = async (req, res, next) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private (Admin)
const updateStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private (Admin)
const deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    res.status(200).json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStores, getStore, createStore, updateStore, deleteStore };
