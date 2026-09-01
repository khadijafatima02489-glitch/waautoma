import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, MessageCircle, Settings, Sparkles, LogOut, Pizza, CreditCard, Sheet } from "lucide-react";
import { apiGet, type WhatsAppConfig } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ConnectionBadge } from "@/components/StatusBadge";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [["/dashboard", "Dashboard", LayoutDashboard], ["/orders", "Orders", ShoppingBag], ["/customers", "Customers", Users], ["/menu", "Menu", UtensilsCrossed], ["/whatsapp", "WhatsApp", MessageCircle], ["/google-sheets", "Google Sheets", Sheet], ["/billing", "Billing", CreditCard], ["/settings", "Restaurant Settings", Settings], ["/ai-settings", "AI Settings", Sparkles]] as const;
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, logout } = useAuth(); const location = useLocation();
  const waQuery = useQuery({ queryKey: ["whatsapp-config"], queryFn: () => apiGet<WhatsAppConfig>("/whatsapp/config"), refetchInterval: 20000 });
  return <div data-testid="dashboard-shell" className="flex min-h-screen bg-background text-foreground">
    <aside className="hidden w-64 flex-col border-r border-[#E5E7E2] bg-white md:flex">
      <div className="flex items-center gap-3 border-b border-[#E5E7E2] px-6 py-6"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#D94833] text-white"><Pizza size={20} /></div><div><p data-testid="restaurant-name" className="font-heading font-bold">{session?.restaurant?.name}</p><p className="text-xs text-[#6E736D]">AI Ordering</p></div></div>
      <nav className="flex-1 space-y-1 px-3 py-5">{navigation.map(([to, label, Icon]) => <NavLink key={to} to={to} data-testid={`nav-${label.toLowerCase().replaceAll(" ", "-")}`} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-200 hover:translate-x-0.5 ${isActive ? "bg-[#2C614F] text-white" : "text-[#6E736D] hover:bg-[#F3F4F1] hover:text-[#1A1D1A]"}`}><Icon size={18} />{label}</NavLink>)}</nav>
      <div className="flex items-center justify-between border-t border-[#E5E7E2] p-4"><ThemeToggle/><button data-testid="logout-button" onClick={logout} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#6E736D] hover:bg-rose-50 hover:text-rose-700"><LogOut size={16} /> Log out</button></div>
    </aside>
    <main key={location.pathname} className="min-w-0 flex-1 overflow-y-auto p-5 md:p-8 lg:p-10"><div className="mb-6 flex items-center justify-between md:hidden"><p className="font-heading text-lg font-bold">{session?.restaurant?.name}</p><ConnectionBadge status={waQuery.data?.status} /></div>{children}</main>
  </div>;
}