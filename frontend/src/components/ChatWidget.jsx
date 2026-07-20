import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chatbot from "../pages/Chatbot";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 flex flex-col">

                    {/* Header */}
                    <div className="bg-yellow-500 text-black flex justify-between items-center px-4 py-3 rounded-t-xl">
                        <h2 className="font-semibold">FieldHub AI</h2>

                        <button onClick={() => setIsOpen(false)}>
                            <X size={22} />
                        </button>
                    </div>

                    {/* Chatbot */}
                    <div className="flex-1 overflow-hidden">
                        <Chatbot />
                    </div>

                </div>
            )}

            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-yellow-500 hover:bg-yellow-400 shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-110"
            >
                <MessageCircle size={30} className="text-black" />
            </button>
        </>
    );
}