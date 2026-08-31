# PRD — AI Restaurant WhatsApp Ordering SaaS

Imported from `seri-student/waautomation` main branch and migrated into the starter’s FastAPI/Vite conventions. The product is a multi-tenant Pakistani restaurant ordering dashboard with a controlled Gemini assistant, deterministic pricing, simulator-driven WhatsApp flow, live order management, customer records, menu CRUD, analytics, human handoff, and provider abstraction.

## MVP acceptance
- Demo owner can log in with `owner@pizzapalace.pk` / `palace123`.
- Dashboard shows seeded Pizza Palace data.
- Simulator accepts natural-language order messages and persists the conversation/order.
- Staff can update order status and see status messages in the conversation.
- External WhatsApp providers are configuration-ready but not claimed as live without credentials.