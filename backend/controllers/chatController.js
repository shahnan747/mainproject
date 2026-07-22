const { askAI } = require("../services/aiService");

const chat = async (req, res) => {

    try {

        const { message } = req.body;

        const reply = await askAI(message);

        res.status(200).json({
            success: true,
            reply
        });

    } catch (err) {

        console.error("Chat Error:", err);

        res.status(500).json({
            success: false,
            message: "AI Error"
        });

    }

};

module.exports = chat;