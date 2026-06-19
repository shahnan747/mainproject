const mongoose = require("mongoose");

const aiHistorySchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    suggestedItems: [
      {
        productName: String,
        suggestedQuantity: Number,
      },
    ],
    type: {
      type: String,
      enum: ["order_suggestion", "payment_analytics", "general"],
      default: "order_suggestion",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIHistory", aiHistorySchema);
