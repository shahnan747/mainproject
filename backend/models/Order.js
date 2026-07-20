const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    fieldAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Field agent is required"],
    },
    orderDate: {
      type: Date,
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft","collected", "assigned", "loaded", "delivered"],
      default: "draft",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
    paymentDate: {
      type: Date,
    },
    assignedDeliveryPersonnel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-calculate totalAmount before saving
orderSchema.pre("save", function () {
    if (this.items?.length) {
      this.totalAmount = this.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
  });

module.exports = mongoose.model("Order", orderSchema);
