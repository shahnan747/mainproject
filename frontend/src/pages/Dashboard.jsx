import Layout from "../components/Layout";
import AdminDashboard from "../dashboard/AdminDashboard";
import AgentDashboard from "../dashboard/AgentDashboard";
import DeliveryDashboard from "../dashboard/DeliveryDashboard";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    let content;

    if (user.role === "admin") content = <AdminDashboard />;
    else if (user.role === "agent") content = <AgentDashboard />
    else if (user.role === "delivery") content = <DeliveryDashboard />;

    return <Layout>{content}</Layout>;
}