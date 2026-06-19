import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full min-h-screen bg-[#111827] p-6 md:ml-64">
        {children}
      </div>
    </div>
  );
}