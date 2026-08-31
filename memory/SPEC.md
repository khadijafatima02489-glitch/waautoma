# AI Restaurant WhatsApp Ordering SaaS

## What it does
Restaurant owners manage a seeded Pizza Palace dashboard while a controlled Gemini assistant takes WhatsApp-style orders through the built-in Simulator. The provider abstraction also supports Baileys, Evolution API, and Meta Cloud API configuration.

## Data model
Mongo collections: users, restaurants, ai_settings, whatsapp_connections, menu_categories, menu_items, customers, conversations, messages, orders, counters. Documents use string UUIDs and tenant scope through `restaurant_id`.

## Key flows
- Login with the seeded owner account, then view dashboard analytics and orders.
- Use WhatsApp → Test Simulator to send customer messages; the AI reads the real menu, mutates the cart only through backend tools, computes totals deterministically, and creates an order after explicit confirmation.
- Open Orders, inspect an order, and advance New → Confirmed → Preparing → Ready → Out for Delivery → Delivered; status notifications are persisted in the conversation and sent through the selected provider.
- Manage menu, customers, restaurant settings, AI settings, provider configuration, and human handoff.
- AI replies are normalized to WhatsApp syntax before persistence and delivery: `*bold*` is used instead of Markdown `**bold**`.
- Meta Cloud API has a tenant-scoped masked credential form for App ID, App Secret, Graph URL, Phone Number ID, WABA ID, Access Token, and Verify Token; blank secret fields never overwrite saved secrets and webhook URLs use the configured public app URL.

## Auth
JWT bearer tokens are stored by the frontend in localStorage and sent in the Authorization header. Every protected query is scoped to the authenticated user’s restaurant.

## Integrations
The backend uses the Emergent Universal LLM key with `emergentintegrations` and Gemini `gemini-3-flash-preview`. The Simulator is fully usable without external WhatsApp credentials. Baileys is a free self-hosted QR provider with per-restaurant persistent sessions under `whatsapp-gateway/sessions`; Evolution and Meta remain configuration-dependent.