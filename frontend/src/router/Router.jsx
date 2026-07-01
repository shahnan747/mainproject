import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CreateOrder from "../dashboard/CreateOrder";
import OrderHistory from "../dashboard/OrderHistory";
import SignUp from "../forms/SignUp";
import Login from "../forms/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AssignOrders from "../dashboard/AssignOrders";
import AnalyticsDashboard from "../dashboard/AnalyticsDashboard";
import DeliveryDashboard from "../dashboard/DeliveryDashboard";
import MyDeliveries from "../dashboard/MyDeliveries";
import AgentDashboard from "../dashboard/AgentDashboard";
import Layout from "../components/Layout";
import AIPage from "../dashboard/AIPage";
import Stores from "../dashboard/Stores";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    },
    {
        path: "/order",
        element: <CreateOrder />
    },
    {
        path: "/agentdashboard",
        element: (
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
                <Layout>
                    <AgentDashboard />
                </Layout>
            </ProtectedRoute>
        )
    },
    {
        path: "/deliverydashboard",
        element: (
            <ProtectedRoute allowedRoles={["admin", "delivery"]}>
                <Layout>
                    <DeliveryDashboard />
                </Layout>
            </ProtectedRoute>
        )
    },
    {
        path: "/history",
        element: <OrderHistory />
    },
    {
        path: "/assign",
        element: <AssignOrders />
    },
    {
        path: "/analytics",
        element: <AnalyticsDashboard />
    },
    {
        path: "/deliveries",
        element: <MyDeliveries />
    },
    {
        path: "/stores",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <Stores />
            </ProtectedRoute>
        )
    },
    {
        path: "/ai",
        element: (
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
                <AIPage />
            </ProtectedRoute>
        )
    },



]);

export default router;