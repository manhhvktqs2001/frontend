// API service for EDR dashboard - fetch data from backend

const API_BASE = "http://192.168.20.85:5000/api/v1/dashboard";

// Fetch dashboard statistics
export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

// Fetch agents overview
export async function fetchAgentsOverview() {
  const res = await fetch(`${API_BASE}/agents-overview`);
  if (!res.ok) throw new Error("Failed to fetch agents overview");
  return res.json();
}

// Fetch alerts overview (default 24h)
export async function fetchAlertsOverview(hours = 24) {
  const res = await fetch(`${API_BASE}/alerts-overview?hours=${hours}`);
  if (!res.ok) throw new Error("Failed to fetch alerts overview");
  return res.json();
}

// Fetch threats overview (default 24h)
export async function fetchThreatsOverview(hours = 24) {
  const res = await fetch(`${API_BASE}/threats-overview?hours=${hours}`);
  if (!res.ok) throw new Error("Failed to fetch threats overview");
  return res.json();
}

// Fetch events timeline (default 24h, granularity hour)
export async function fetchEventsTimeline(hours = 24, granularity = "hour") {
  const res = await fetch(`${API_BASE}/events-timeline?hours=${hours}&granularity=${granularity}`);
  if (!res.ok) throw new Error("Failed to fetch events timeline");
  return res.json();
}

// Fetch system overview
export async function fetchSystemOverview() {
  const res = await fetch(`${API_BASE}/system-overview`);
  if (!res.ok) throw new Error("Failed to fetch system overview");
  return res.json();
}

// Fetch real-time stats
export async function fetchRealTimeStats() {
  const res = await fetch(`${API_BASE}/real-time-stats`);
  if (!res.ok) throw new Error("Failed to fetch real-time stats");
  return res.json();
} 