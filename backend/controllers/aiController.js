const groq = require("../utils/groqClient");
const Order = require("../models/Order");
const AIHistory = require("../models/AIHistory");
const Product = require("../models/Product");

// @desc    Smart Order Auto-Fill — AI suggests quantities based on store's past orders
// @route   POST /api/ai/generate
// @access  Private (Field Agent, Admin)
const generateOrderSuggestion = async (req, res, next) => {
  try {
    const { storeId } = req.body;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "storeId is required",
      });
    }

    // Fetch last 5 orders of the store
    const pastOrders = await Order.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.productId", "name price unit");

    if (pastOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No past orders found for this store. Cannot generate suggestion.",
        data: null,
      });
    }

    // Build readable order history
    const orderSummary = pastOrders
      .map((order, index) => {
        const itemList = order.items
          .map(
            (item) =>
              `${item.productId?.name || "Unknown Product"}: ${
                item.quantity
              } ${item.productId?.unit || "pcs"}`
          )
          .join(", ");

        return `Order ${index + 1} (${new Date(
          order.createdAt
        ).toDateString()}): ${itemList}`;
      })
      .join("\n");

    const prompt = `
You are an AI assistant for a field sales order management system.

Based on the following past orders from a store, suggest quantities for the next order.

Return ONLY valid JSON in this format:

[
  {
    "productName": "Rice",
    "suggestedQuantity": 5
  }
]

Do not include markdown.
Do not include explanations.
Do not wrap the JSON inside \`\`\`.

Past Orders:
${orderSummary}
`;

    // Generate response using Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only assistant. Always return valid JSON arrays.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = completion.choices[0].message.content.trim();

    let suggestedItems = [];

    try {
      suggestedItems = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
        raw: responseText,
      });
    }

    // Convert productName -> productId
    const products = await Product.find({});

    suggestedItems = suggestedItems.map((item) => {
      const matchedProduct = products.find(
        (p) =>
          p.name.toLowerCase().trim() ===
          item.productName.toLowerCase().trim()
      );

      return {
        productId: matchedProduct ? matchedProduct._id : null,
        productName: item.productName,
        suggestedQuantity: item.suggestedQuantity,
      };
    });

    // Save AI history
    await AIHistory.create({
      storeId,
      requestedBy: req.user._id,
      prompt,
      response: responseText,
      suggestedItems,
      type: "order_suggestion",
    });

    res.status(200).json({
      success: true,
      message: "AI order suggestion generated",
      data: {
        suggestedItems,
        basedOnOrders: pastOrders.length,
      },
    });
  } catch (error) {
    console.error("Groq AI Error:", error);
    next(error);
  }
};

// @desc    Payment Delay Analytics
// @route   GET /api/analytics/payment-delays
// @access  Private (Admin)
const getPaymentDelayAnalytics = async (req, res, next) => {
  try {
    const orders = await Order.find({
      paymentStatus: { $in: ["pending", "overdue"] },
    }).populate("storeId", "name location route");

    const storeMap = {};

    orders.forEach((order) => {
      const storeId = order.storeId?._id?.toString();
      if (!storeId) return;

      if (!storeMap[storeId]) {
        storeMap[storeId] = {
          storeId,
          storeName: order.storeId?.name,
          location: order.storeId?.location,
          route: order.storeId?.route,
          pendingAmount: 0,
          orderCount: 0,
          totalDelayDays: 0,
        };
      }

      storeMap[storeId].pendingAmount += order.totalAmount;
      storeMap[storeId].orderCount += 1;

      if (order.dueDate) {
        const today = new Date();
        const due = new Date(order.dueDate);

        const delayDays = Math.max(
          0,
          Math.floor((today - due) / (1000 * 60 * 60 * 24))
        );

        storeMap[storeId].totalDelayDays += delayDays;
      }
    });

    const analytics = Object.values(storeMap).map((store) => ({
      ...store,
      averageDelayDays:
        store.orderCount > 0
          ? Math.round(store.totalDelayDays / store.orderCount)
          : 0,
    }));

    const totalPending = analytics.reduce(
      (sum, s) => sum + s.pendingAmount,
      0
    );

    res.status(200).json({
      success: true,
      summary: {
        totalPendingAmount: totalPending,
        totalStoresWithPending: analytics.length,
      },
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI history for a store
// @route   GET /api/ai/history/:storeId
// @access  Private
const getAIHistory = async (req, res, next) => {
  try {
    const history = await AIHistory.find({
      storeId: req.params.storeId,
    })
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateOrderSuggestion,
  getPaymentDelayAnalytics,
  getAIHistory,
};