# AP Pulse - Smart Indoor Navigation

A smart indoor navigation and engagement platform designed for office environments. Enables employees to navigate efficiently while giving employers insights and monetization opportunities.

## Features

- **Smart Navigation** — Dijkstra-powered shortest path with animated route drawing and travel time estimates
- **Interactive Floor Map** — React Flow–based office layout with clickable nodes
- **Room Availability** — Real-time room status, schedule view, and capacity info
- **Search** — Find rooms and people with auto-suggestions
- **Admin Analytics** — Movement heatmaps, high-traffic zones, and most-used paths
- **Ad Placement** — Define zones on the map, manage promotional content with performance metrics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, React Flow, Vite |
| Backend | Node.js, Express |
| Routing | Dijkstra's Algorithm |
| Icons | Lucide React |

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Start the backend

```bash
cd backend
npm start
# → http://localhost:3001
```

### 3. Start the frontend (dev mode)

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

The frontend dev server proxies `/api/*` requests to the backend on port 3001.

### Production build (local)

```bash
cd frontend && npm run build
# Serve via backend: cd ../backend && npm start
# → http://localhost:3001
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. From the project root, run:

```bash
vercel
```

3. Vercel auto-detects the Vite framework, builds `frontend/`, and deploys the `api/` directory as serverless functions.

Alternatively, connect the GitHub repo at [vercel.com/new](https://vercel.com/new) — it deploys automatically on every push.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shortest-path` | Calculate shortest path (body: `{ start, end }`) |
| `GET` | `/api/graph` | Office graph data (nodes + edges) |
| `GET` | `/api/rooms` | All rooms with availability |
| `GET` | `/api/rooms/:id` | Single room details |
| `GET` | `/api/search?q=` | Search rooms and people |
| `GET` | `/api/people` | All people |
| `GET` | `/api/heatmap` | Heatmap and path usage data |
| `GET` | `/api/ads` | Ad placement zones |

## Project Structure

```
ap-pulse/
├── api/                     # Vercel serverless functions
│   ├── _data/               # Shared JSON data
│   ├── _lib/dijkstra.js     # Pathfinding algorithm
│   ├── shortest-path.js     # POST /api/shortest-path
│   ├── graph.js             # GET  /api/graph
│   ├── rooms/index.js       # GET  /api/rooms
│   ├── rooms/[id].js        # GET  /api/rooms/:id
│   ├── search.js            # GET  /api/search
│   ├── people.js            # GET  /api/people
│   ├── heatmap.js           # GET  /api/heatmap
│   └── ads.js               # GET  /api/ads
├── backend/                 # Express server (local dev)
│   ├── server.js
│   └── data/
├── frontend/                # Vite + React + Tailwind
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── utils/
│   │   └── data/
│   ├── tailwind.config.js
│   └── vite.config.js
├── vercel.json              # Vercel deployment config
└── README.md
```

## Brand Colors

- **Primary Blue**: `#1A4FAD`
- **Primary Red**: `#DC2626`
- **Accent**: `#F59E0B` (Amber)
