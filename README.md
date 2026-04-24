Here is the updated complete `README.md` for your frontend, utilizing colorful, vibrant, and classy icons that pop while maintaining a high-end, professional look.

---

# 🎬 CineMania 🍿

**The Social Streaming Ecosystem — Official Frontend Client**

Welcome to the frontend repository for **CineMania**. This application houses the highly interactive, performance-optimized, and cinematic user interface designed to merge high-fidelity streaming with real-time social networking.

---

### 🏗️ Core Architecture & Stack

The architecture is built on modern React paradigms, heavily utilizing server components for performance and client components for complex, GPU-accelerated micro-interactions.

- **🚀 Framework:** Next.js (App Router)
- **💎 Language:** TypeScript
- **🎨 Styling:** Tailwind CSS & `clsx`/`tailwind-merge` utility patterns
- **⚡ State & Data:** TanStack Query (React Query)
- **🪄 Animation:** Framer Motion
- **🛡️ Form & Validation:** `@tanstack/react-form` paired with Zod
- **🌐 Networking:** Axios (Custom Isomorphic HTTP Client)
- **🧩 Iconography:** Lucide React

---

### 🌟 Core Functionalities

**🔐 Identity & Access Management**

- Secure authentication flows (Login, Registration, Password Reset) fortified with strict Zod validation.
- Hierarchical Role-Based Access Control (RBAC) via Next.js Middleware, gracefully routing standard users and system administrators to their respective domains.
- Next.js server-side cookie management for seamless JWT token refreshing and session repair.

**✨ The Cinematic Experience**

- Premium dark-mode aesthetic utilizing deep obsidian (`#030406`) and glowing emerald/rose accents.
- GPU-accelerated animations, parallax scrolling, and `will-change-transform` optimizations to eliminate sub-pixel rendering jitter.
- `nextjs-toploader` integration for fluid, SPA-like navigation feedback between server routes.

**🔭 Discovery & Streaming**

- Dynamic **Command Center** dashboard serving personalized content.
- Algorithmic Discovery Feed featuring "Resume Session" trackers, "Hot Transmissions" (Trending), and "Aura Alignment" (Recommendations).
- Live Transmissions tracking active social watch parties across the network.

**💬 Social Ecosystem**

- Global Community Feed rendering real-time, intercepted cinematic critiques.
- Interactive review cards with spoiler alerts, rich media attachments, and TanStack Query-powered optimistic updates for endorsements (likes) and comments.
- Deeply nested, recursive comment threading for detailed discussions.

**🏆 Profile & Gamification**

- Immersive user profiles featuring dynamic, saturated avatar-blur backgrounds.
- Interactive **Trophy Case** showcasing unlocked achievements (e.g., _Cinephile_, _Completionist_, _Night Owl_) with smooth, animated lore descriptions.
- Data-driven "Cinematic Taste" genre progression bars.

**💳 Premium Tier & Billing**

- Full Stripe Checkout integration for **PRO** and **PREMIUM** tier upgrades.
- Dynamic `PaymentSuccess` workflows with animated receipt generation, session referencing, and clipboard APIs.
- Tier-based UI state changes and access gates across the application.

---

### ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```env
# 🔌 Networking
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# 💳 External Integrations (Optional/If Applicable)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 🚦 Getting Started

**1. Clone and Install Dependencies**

```bash
npm install
```

**2. Start the Development Server**

```bash
npm run dev
```

The application will boot at `http://localhost:3000`.

**3. Build for Production**

```bash
npm run build
npm run start
```

---

### 📁 Project Structure

```text
src/
├── app/                  # 🛣️ Next.js App Router (Pages, Layouts, Middleware)
│   ├── (commonLayout)/   # Public & shared routes (Discovery, Community)
│   ├── dashboard/        # Protected User routes
│   ├── admin/            # Protected Admin routes
│   └── payment/          # Stripe success/cancel flows
├── components/           # 🧱 Reusable UI components
│   ├── modules/          # Feature-specific components (Auth, Profile, Feed)
│   ├── shared/           # Universal components (Forms, Loaders, Pagination)
│   └── ui/               # Base design system components (shadcn/ui)
├── lib/                  # 🛠️ Utilities (Axios config, Tokens, Nav logic)
├── services/             # 📡 API communication layers (Auth, Reviews, Payments)
├── types/                # 📝 Global TypeScript interfaces
└── zod/                  # 🛡️ Schema definitions for form and data validation
```
