import { useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import { syncOfflineDrafts } from "../services/syncService"; 


export default function Layout({ children }) {

   useEffect(() => {

        const handleOnline = async () => {
            console.log("🌐 Internet connection restored. Syncing offline drafts...");
            await syncOfflineDrafts();
        };

        // Listen for internet connection restoration
        window.addEventListener("online", handleOnline);

        // If the app starts while online, try syncing any pending drafts
        if (navigator.onLine) {
            syncOfflineDrafts();
        }

        // Cleanup listener
        return () => {
            window.removeEventListener("online", handleOnline);
        };

    }, []);
    
  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full min-h-screen bg-[#111827] p-6 md:ml-64">
        {children}
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />

    </div>
  );
}