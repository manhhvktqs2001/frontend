// API service for EDR dashboard - fetch data from backend

// Use relative URL that will be proxied by Vite
const API_BASE = "/api/v1/dashboard";

// Common fetch options
const fetchOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
};

// Fetch dashboard statistics
export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch dashboard stats`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// Fetch agents overview
export async function fetchAgentsOverview() {
  try {
    const res = await fetch(`${API_BASE}/agents-overview`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch agents overview`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching agents overview:', error);
    throw error;
  }
}

// Fetch alerts overview (default 24h)
export async function fetchAlertsOverview(hours = 24) {
  try {
    const res = await fetch(`${API_BASE}/alerts-overview?hours=${hours}`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch alerts overview`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching alerts overview:', error);
    throw error;
  }
}

// Fetch threats overview (default 24h)
export async function fetchThreatsOverview(hours = 24) {
  try {
    const res = await fetch(`${API_BASE}/threats-overview?hours=${hours}`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch threats overview`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching threats overview:', error);
    throw error;
  }
}

// Fetch events timeline (default 24h, granularity hour)
export async function fetchEventsTimeline(hours = 24, granularity = "hour") {
  try {
    const res = await fetch(`${API_BASE}/events-timeline?hours=${hours}&granularity=${granularity}`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch events timeline`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching events timeline:', error);
    throw error;
  }
}

// Fetch system overview
export async function fetchSystemOverview() {
  try {
    const res = await fetch(`${API_BASE}/system-overview`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch system overview`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching system overview:', error);
    throw error;
  }
}

// Fetch real-time stats
export async function fetchRealTimeStats() {
  try {
    const res = await fetch(`${API_BASE}/real-time-stats`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch real-time stats`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching real-time stats:', error);
    throw error;
  }
}