import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MessageCircle, Smartphone, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost, type WhatsAppConfig } from "@/lib/api";
import { ConnectionBadge } from "@/components/StatusBadge";
import Simulator from "@/components/Simulator";

const providers = [
  { id: "simulator", title: "Built-in Simulator", description: "Test the full ordering flow without credentials.", icon: Smartphone },
  { id: "baileys", title: "Baileys QR", description: "Connect through the built-in gateway.", icon: Zap },
  { id: "evolution", title: "Evolution API", description: "Self-hosted QR provider for development.", icon: MessageCircle },
  { id: "meta", title: "Meta Cloud API", description: "Official WhatsApp provider for production.", icon: CheckCircle2 },
];

export default function WhatsAppPage() {
  const [tab, setTab] = useState<"connection" | "simulator">("connection");
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["whatsapp-config"], queryFn: () => apiGet<WhatsAppConfig>("/whatsapp/config") });
  const mutation = useMutation({ mutationFn: (provider: string) => apiPost<WhatsAppConfig>("/whatsapp/provider", { provider }), onSuccess: (data) => client.setQueryData(["whatsapp-config"], data) });
  const wa = query.data;
  return <div data-testid="whatsapp-page" className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2C614F]">Customer channels</p><h1 data-testid="whatsapp-heading" className="mt-2 font-heading text-4xl font-extrabold">WhatsApp</h1><p className="mt-2 text-[#6E736D]">Connect a number or test the assistant in the built-in Simulator.</p></div>{wa && <ConnectionBadge status={wa.status} />}</div>
    <div className="flex gap-2 border-b border-[#E5E7E2]"><button data-testid="whatsapp-connection-tab" onClick={() => setTab("connection")} className={`border-b-2 px-4 py-3 text-sm font-semibold ${tab === "connection" ? "border-[#D94833] text-[#D94833]" : "border-transparent text-[#6E736D]"}`}>Connection</button><button data-testid="whatsapp-simulator-tab" onClick={() => setTab("simulator")} className={`border-b-2 px-4 py-3 text-sm font-semibold ${tab === "simulator" ? "border-[#D94833] text-[#D94833]" : "border-transparent text-[#6E736D]"}`}>Test Simulator</button></div>
    {tab === "simulator" ? <div data-testid="simulator-panel"><Simulator /></div> : <><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{providers.map(({ id, title, description, icon: Icon }) => <button data-testid={`provider-${id}`} key={id} onClick={() => mutation.mutate(id)} className={`rounded-2xl border p-4 text-left transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-md ${wa?.provider === id ? "border-[#D94833] bg-[#FDE9E5]" : "border-[#E5E7E2] bg-white"}`}><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF4ED] text-[#2C614F]"><Icon size={19} /></span>{wa?.provider === id && <CheckCircle2 size={18} className="text-[#D94833]" />}</div><p className="mt-4 font-heading font-bold">{title}</p><p className="mt-1 text-xs leading-relaxed text-[#6E736D]">{description}</p></button>)}</div><Card data-testid="active-provider-card" className="rounded-2xl border-[#E5E7E2]"><CardContent className="p-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E736D]">Active provider</p><h2 data-testid="active-provider-name" className="mt-2 font-heading text-2xl font-bold capitalize">{wa?.provider || "simulator"}</h2><p data-testid="provider-detail" className="mt-2 text-sm text-[#6E736D]">{wa?.provider === "simulator" ? "Simulator is always connected and ready for end-to-end testing." : "Add provider credentials in this workspace when you are ready to connect a live number."}</p>{wa?.provider === "simulator" && <Button data-testid="open-simulator-button" onClick={() => setTab("simulator")} className="mt-5 rounded-full bg-[#2C614F] hover:bg-[#235041]">Open Test Simulator</Button>}</CardContent></Card></>}
  </div>;
}