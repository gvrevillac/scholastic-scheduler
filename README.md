# Scholastic Scheduler

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gvrevillac/scholastic-scheduler)

A production-ready full-stack chat application built on Cloudflare Workers. Features real-time chat boards, user management, and scalable storage using a single shared Durable Object namespace for multiple entity types. Includes a modern React frontend with shadcn/ui, Tailwind CSS, and TanStack Query for seamless development.

## ✨ Key Features

- **Multi-Entity Durable Objects**: Efficiently manage Users and ChatBoards in a single Global Durable Object with automatic indexing and pagination.
- **Real-Time Chat**: Send and list messages per chat board with optimistic updates.
- **Type-Safe API**: Shared types between frontend and backend with full TypeScript support.
- **Modern UI**: Responsive design with shadcn/ui components, dark mode, and Tailwind CSS.
- **Serverless Deployment**: Zero-config deployment to Cloudflare Workers with automatic asset bundling.
- **CRUD Operations**: Create, list, update, and delete users, chats, and messages with batch support.
- **Seed Data**: Pre-populated mock data for quick testing.
- **Error Handling**: Robust client and server-side error reporting.

## 🛠️ Technology Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Frontend**: React 18, Vite, TypeScript, TanStack Query, React Router
- **UI**: shadcn/ui, Tailwind CSS, Lucide React icons, Sonner toasts
- **State & Forms**: Zustand, React Hook Form, Zod validation
- **Dev Tools**: Bun, ESLint, Wrangler

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed (≥1.0)
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Cloudflare account with Workers enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Generate Worker types:
   ```
   bun run cf-typegen
   ```

### Development

Start the development server:
```
bun run dev
```

The app will be available at `http://localhost:3000` (or `$PORT`).

### Production Build

```
bun run build
```

Assets are built to `dist/` and Worker to `worker/dist/`.

## 📖 API Usage

The backend exposes a RESTful API at `/api/*`. All responses follow `{ success: boolean; data?: T; error?: string }`.

### Users
```
GET    /api/users?cursor=abc&limit=10     # List users (paginated)
POST   /api/users                         # { name: string }
DELETE /api/users/:id
POST   /api/users/deleteMany              # { ids: string[] }
```

### Chats
```
GET    /api/chats?cursor=abc&limit=10     # List chats
POST   /api/chats                         # { title: string }
GET    /api/chats/:chatId/messages        # List messages
POST   /api/chats/:chatId/messages        # { userId: string; text: string }
DELETE /api/chats/:id
POST   /api/chats/deleteMany              # { ids: string[] }
```

Frontend uses `src/lib/api-client.ts` for type-safe requests:
```ts
import { api } from '@/lib/api-client';

const users = await api<User[]>('/api/users');
```

## ⚙️ Project Structure

```
├── shared/              # Shared types & mock data
├── src/                 # React frontend
│   ├── components/ui/   # shadcn/ui components
│   ├── pages/           # Route pages
│   └── lib/             # Utilities & hooks
├── worker/              # Cloudflare Worker backend
│   ├── core-utils.ts    # Entity base classes
│   ├── entities.ts      # UserEntity, ChatBoardEntity
│   └── user-routes.ts   # Add custom routes here
├── tsconfig*.json       # TypeScript configs
└── wrangler.jsonc       # Worker config (DO NOT MODIFY)
```

**Extend the app**:
- Add entities: Extend `IndexedEntity` in `worker/entities.ts`
- Add routes: Import entities in `worker/user-routes.ts`
- UI pages: Add to `src/pages/` and update `src/main.tsx` router

## ☁️ Deployment

1. Login to Cloudflare:
   ```
   wrangler login
   ```
2. Deploy:
   ```
   bun run deploy
   ```
   Or one-click deploy:

   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gvrevillac/scholastic-scheduler)

3. Set up custom domain in Workers dashboard (optional).

**Note**: Durable Objects use SQLite storage. Migrations are pre-configured in `wrangler.jsonc`.

## 🤝 Contributing

1. Fork & clone
2. Install deps: `bun install`
3. Make changes
4. Lint: `bun run lint`
5. Test locally: `bun run dev`
6. PR with clear description

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- File issues for bugs or feature requests

Built with ❤️ for Cloudflare Workers.