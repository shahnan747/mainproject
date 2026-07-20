import { useState } from "react";
import api from "../api/api";

export default function Chatbot() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = message;

        // Show user's message immediately
        setChat((prev) => [
            ...prev,
            { role: "user", text: userMessage }
        ]);

        setMessage("");

        try {
            const response = await api.post("/chat", {
                message: userMessage,
            });

            setChat((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: response.data.reply,
                },
            ]);
        } catch (error) {
            console.error("Chat error:", error);

            setChat((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Sorry, I couldn't process your request.",
                },
            ]);
        }
    };

    return (
        <div className="h-full bg-gray-800 flex flex-col">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {chat.length === 0 && (
                    <p className="text-gray-400 text-center mt-10">
                        👋 Hi! Ask me anything about your FieldHub data.
                    </p>
                )}

                {chat.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg break-words ${
                                msg.role === "user"
                                    ? "bg-yellow-500 text-black"
                                    : "bg-gray-700 text-white"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-4 flex gap-3">

                <input
                    type="text"
                    placeholder="Ask FieldHub AI..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    className="flex-1 rounded-lg bg-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                <button
                    onClick={sendMessage}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition"
                >
                    Send
                </button>

            </div>

        </div>
    );
}