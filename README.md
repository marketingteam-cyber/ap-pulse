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

### Production build

```bash
cd frontend && npm run build
# Serve via backend: cd ../backend && npm start
# → http://localhost:3001
```

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
├── backend/
│   ├── server.js          # Express server + Dijkstra
│   └── data/              # Mock JSON data
│       ├── graph.json     # Office graph (nodes + weighted edges)
│       ├── rooms.json     # Room details and schedules
│       ├── people.json    # Employee directory
│       ├── heatmap.json   # Traffic analytics
│       └── ads.json       # Ad placement zones
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main application shell
│   │   ├── components/    # React components
│   │   ├── utils/         # API helpers
│   │   └── data/          # Frontend mock data
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Brand Colors

- **Primary Blue**: `#1A4FAD`
- **Primary Red**: `#DC2626`
- **Accent**: `#F59E0B` (Amber)
