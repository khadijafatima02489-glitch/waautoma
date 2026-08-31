import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { RealtimeProvider } from "@/context/RealtimeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import Menu from "@/pages/Menu";
import WhatsAppPage from "@/pages/WhatsAppPage";
import Settings from "@/pages/Settings";
import AISettings from "@/pages/AISettings";

function Protected({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div data-testid="auth-loading" className="min-h-screen grid place-items-center text-muted-foreground">Loading workspace…</div>;
  if (!session) return <Navigate to="/login" replace />;
  return <RealtimeProvider><DashboardLayout>{children}</DashboardLayout></RealtimeProvider>;
}

export default function App() {
  return (
    <AuthProvider><Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
      <Route path="/customers" element={<Protected><Customers /></Protected>} />
      <Route path="/customers/:id" element={<Protected><CustomerDetail /></Protected>} />
      <Route path="/menu" element={<Protected><Menu /></Protected>} />
      <Route path="/whatsapp" element={<Protected><WhatsAppPage /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="/ai-settings" element={<Protected><AISettings /></Protected>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes></AuthProvider>
  );
}
