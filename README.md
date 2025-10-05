## 🧩 Auth API + Blog Management (TypeScript + Prisma + MongoDB)

A secure REST API built with Express, TypeScript, Prisma (MongoDB), and JWT authentication — ready for local development and Vercel deployment.

---

### 🚀 Features

- **Authentication**: JWT-based auth, bcrypt password hashing
- **Roles**: `admin` and `user` via Prisma enum
- **Blogs**: CRUD for posts, public read, view counter, featured flag, tags/categories, thumbnail URL
- **Validation & Safety**: Zod validation, centralized error handler, security headers via Helmet, CORS, cookies
- **Deploy**: Serverless-friendly handler for Vercel (`api/index.ts`)

---

### 🧠 Tech Stack

- **Runtime**: Node.js (>=18)
- **Framework**: Express + TypeScript
- **ORM**: Prisma (MongoDB provider)
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, Cookie Parser
- **Deploy**: Vercel Functions

---

### 📁 Folder Structure

```
.
├── api/
│   └── index.ts                # Vercel serverless entry (wraps Express app)
├── prisma/
│   └── schema.prisma           # MongoDB schema (User, Blog, Role)
├── src/
│   ├── app.ts                  # Express app wiring (routes, middlewares)
│   ├── server.ts               # Local dev server
│   ├── config/
│   │   ├── prisma.ts           # Prisma client
│   │   └── jwt.ts              # JWT helpers
│   ├── middlewares/
│   │   ├── auth.ts             # Auth guard / role checks
│   │   ├── errorHandler.ts     # Global error handler
│   │   └── validate.ts         # Zod validation helper
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   └── user.routes.ts
│   │   └── blog/
│   │       ├── blog.controller.ts
│   │       └── blog.routes.ts
│   └── services/
│       ├── blog.service.ts
│       └── user.service.ts
├── vercel.json                 # Vercel function + routing config
├── tsconfig.json
└── package.json
```

---

### ⚙️ Setup & Installation

1) Clone and install

```bash
git clone <your-repo-url>
cd <repo>
npm install
```

2) Environment variables (`.env`)

```env
# Database (MongoDB connection string)
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

# JWT
JWT_SECRET="your-super-secret"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

3) Prisma setup

```bash
npm run prisma:gen   # generate Prisma client
npm run prisma:push  # push schema to MongoDB
```

4) Start local dev server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

Health check: `GET /health` → `{ ok: true }`

---

### 🌐 Live Deployment

- Production base URL: `https://a7-blog-server.vercel.app`
- Health endpoint: [`/health`](https://a7-blog-server.vercel.app/health) → `{ ok: true }`

---

### 🧭 API Overview

- Local base URL: `http://localhost:5000/api`
- Production base URL: `https://a7-blog-server.vercel.app/api`

- Auth
  - `POST /api/auth/login` — Login and receive JWT (typically set in cookie)

- Users
  - `POST /api/users/register` — Register a new user

- Blogs
  - `GET /api/blogs` — Public: list blogs (supports pagination in controller)
  - `GET /api/blogs/:id` — Public: get single blog (increments view count)
  - `POST /api/blogs` — Admin: create blog
  - `PATCH /api/blogs/:id` — Admin: update blog
  - `DELETE /api/blogs/:id` — Admin: delete blog

Blog model highlights (from Prisma): `title`, `content`, optional `excerpt`, `thumbnailUrl`, `isFeatured`, `views`, `tags[]`, `categories[]`, `author` relation, timestamps.

---

### 🧰 NPM Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "vercel-build": "prisma generate && tsc",
  "prisma:gen": "prisma generate",
  "prisma:push": "prisma db push",
  "postinstall": "prisma generate"
}
```

---

### ☁️ Deploy on Vercel

- The project exposes a serverless handler via `api/index.ts` that imports the Express app from `src/app.ts`.
- `vercel.json` routes all traffic to `api/index.ts` and includes Prisma client files:

```json
{
  "version": 2,
  "functions": {
    "api/index.ts": {
      "includeFiles": "node_modules/.prisma/client/**",
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```

Steps:

1) Push your repository to GitHub
2) Import into Vercel
3) Add Environment Variables (Project → Settings → Environment Variables):
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (optional, default `7d`)
   - `CORS_ORIGIN`
4) Deploy

Notes:

- Prisma generator targets include `debian-openssl-3.0.x` for Vercel compatibility.
- Ensure your MongoDB network access allows Vercel IPs or uses Atlas with proper access.

---

### 🧩 Example Blog JSON

```json
{
  "_id": "68de1a938697c8d50facdcae",
  "title": "React Deep Dive",
  "content": "<p>Everything about React...</p>",
  "excerpt": "A quick guide to React fundamentals",
  "tags": ["react", "frontend"],
  "categories": ["tech"],
  "thumbnailUrl": "https://cdn.example.com/react-thumb.jpg",
  "isFeatured": true,
  "views": 42,
  "author": {
    "_id": "68df9e4e01406aa50ba7abb1",
    "name": "Admin",
    "email": "admin@blog.com"
  },
  "createdAt": "2025-10-02T06:24:19.565Z",
  "updatedAt": "2025-10-02T06:24:19.727Z",
  "__v": 0
}
```

---

### 📜 License

MIT License © 2025 — Your Name

---

### 💡 Notes

- Stateless API: JWT handled via tokens (commonly set as HTTP-only cookie).
- Works locally and on Vercel out of the box.
- Ready to integrate with any frontend (Next.js/React recommended).


