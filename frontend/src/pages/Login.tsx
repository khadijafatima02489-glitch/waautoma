import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ApiError, formatApiError } from "@/lib/api";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("owner@pizzapalace.pk");
  const [password, setPassword] = useState("palace123");
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setLoading(true);
    try { if (mode === "login") await login(email, password); else await register({ name, restaurant_name: restaurantName, email, password }); navigate("/dashboard"); }
    catch (err) { setError(err instanceof ApiError ? formatApiError(err.body) : "Unable to sign in"); }
    finally { setLoading(false); }
  };
  return <div data-testid="login-page" className="min-h-screen bg-[#F9FAF8] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
    <section className="relative hidden overflow-hidden bg-[#1A1D1A] p-12 text-white lg:flex lg:flex-col lg:justify-between"><img src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1000&q=80" alt="Signature burger and fries" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="relative z-10 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#D94833]"><Pizza size={24} /></div><span className="font-heading text-xl font-bold">AI Restaurant Assistant</span></div><div className="relative z-10 max-w-lg"><h1 data-testid="login-hero-heading" className="font-heading text-5xl font-extrabold leading-tight">Your 24/7 WhatsApp receptionist that takes orders.</h1><p className="mt-5 text-white/75">Greet customers in English, Urdu, and Roman Urdu while your team watches everything live from one dashboard.</p></div><p className="relative z-10 text-sm text-white/60">Built for restaurants in Pakistan</p></section>
    <section className="flex items-center justify-center p-6"><div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#D94833] text-white"><Pizza size={20} /></div><span className="font-heading text-lg font-bold">AI Restaurant Assistant</span></div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2C614F]">Pizza Palace workspace</p><h2 data-testid="login-heading" className="font-heading text-3xl font-extrabold">{mode === "login" ? "Welcome back" : "Create your workspace"}</h2><p className="mt-2 text-[#6E736D]">{mode === "login" ? "Sign in to manage your restaurant." : "Start with your own restaurant and menu."}</p><div className="mt-7 flex rounded-full border border-[#E5E7E2] bg-white p-1"><button type="button" data-testid="login-mode-button" onClick={() => setMode("login")} className={`flex-1 rounded-full py-2 text-sm font-semibold ${mode === "login" ? "bg-[#2C614F] text-white" : "text-[#6E736D]"}`}>Sign in</button><button type="button" data-testid="register-mode-button" onClick={() => setMode("register")} className={`flex-1 rounded-full py-2 text-sm font-semibold ${mode === "register" ? "bg-[#2C614F] text-white" : "text-[#6E736D]"}`}>Create account</button></div><form data-testid="auth-form" onSubmit={submit} className="mt-6 space-y-4">{mode === "register" && <><div><Label htmlFor="name">Your name</Label><Input id="name" data-testid="register-name-input" value={name} onChange={(e) => setName(e.target.value)} required /></div><div><Label htmlFor="restaurant">Restaurant name</Label><Input id="restaurant" data-testid="register-restaurant-input" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required /></div></>}<div><Label htmlFor="email">Email</Label><Input id="email" data-testid="login-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div><Label htmlFor="password">Password</Label><Input id="password" data-testid="login-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>{error && <p data-testid="auth-error" className="text-sm text-rose-700">{error}</p>}<Button type="submit" data-testid="login-submit-button" disabled={loading} className="h-11 w-full gap-2 rounded-full bg-[#D94833] hover:bg-[#C23E2A]">{loading ? <Loader2 className="animate-spin" size={16} /> : <>{mode === "login" ? "Sign in" : "Create account"}<ArrowRight size={16} /></>}</Button></form>{mode === "login" && <div data-testid="demo-credentials" className="mt-6 rounded-2xl border border-[#D9E8DE] bg-[#EAF4ED] p-4 text-sm"><p className="font-semibold text-[#2C614F]">Demo account</p><p className="mt-1 text-[#6E736D]">owner@pizzapalace.pk · palace123</p></div>}</div></section>
  </div>;
}