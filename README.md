# Mediva AI

Self-medication guidance for pregnant women, combining cutting-edge AI with responsible human oversight.

---

## ✨ Why Mediva AI?
Pregnancy often comes with new symptoms and questions about which medicines are safe. Mediva AI delivers on-demand, evidence-based advice while keeping the expectant mother at the center of every decision.

## 🏗️ Architecture at a Glance
| Layer | Technology | Purpose |
|-------|------------|---------|
| Personal Memory | **SuperMemory** | Stores user context, preferences, and medical history in a privacy-focused layer. |
| Orchestration | **AI SDK** | Coordinates multiple medical agents (LLMs, tools, fallback flows). |
| Knowledge Base | **Supabase pgvector** | Vector-searchable drug & contraindication database. |
| Safety Net | **Human-in-the-Loop** | Pharmacists & OB-GYNs verify or override AI suggestions when confidence is low. |

## 🔑 Core Features
- **Personalized drug safety checks** for each pregnancy stage.
- **Conversational chat interface** built with Next.js & Vercel Edge runtime.
- **Automatic escalation** to licensed professionals on ambiguous cases.
- **Audit trail** of AI & human decisions for transparency.

## 🚀 Getting Started
1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Set environment variables** (see `.env.example`).
3. **Run development server**
   ```bash
   pnpm dev
   ```
4. Open <http://localhost:3000> and start chatting.

## 📂 Project Structure (excerpt)
```
src/
  app/            # Next.js app router
  components/     # Reusable UI & AI elements
  ai/             # Agent logic & tools
  lib/            # Supabase clients & helpers
```

## ❤️ Contributing
We welcome pull requests from healthcare professionals and developers alike. Please open an issue first to discuss your idea.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
