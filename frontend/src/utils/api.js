const API_BASE = '/api';

export async function fetchGraph() {
  const res = await fetch(`${API_BASE}/graph`);
  return res.json();
}

export async function fetchRooms() {
  const res = await fetch(`${API_BASE}/rooms`);
  return res.json();
}

export async function fetchRoom(id) {
  const res = await fetch(`${API_BASE}/rooms/${id}`);
  return res.json();
}

export async function fetchShortestPath(start, end) {
  const res = await fetch(`${API_BASE}/shortest-path`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start, end }),
  });
  return res.json();
}

export async function searchAll(query) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function fetchHeatmap() {
  const res = await fetch(`${API_BASE}/heatmap`);
  return res.json();
}

export async function fetchAds() {
  const res = await fetch(`${API_BASE}/ads`);
  return res.json();
}

export async function fetchPeople() {
  const res = await fetch(`${API_BASE}/people`);
  return res.json();
}
