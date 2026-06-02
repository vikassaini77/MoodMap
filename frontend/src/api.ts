const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const register = async (email, password, full_name) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name })
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

export const saveJournalEntry = async (data) => {
  const response = await fetch(`${API_BASE}/journal`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to save journal entry');
  }
  return response.json();
};

export const getInsights = async (userId) => {
  const response = await fetch(`${API_BASE}/insights`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId })
  });
  if (!response.ok) {
    throw new Error('Failed to get insights');
  }
  return response.json();
};

export const sendChatMessage = async (sessionId, messages, companionType, mood, imageBase64 = null, customInstructions = null) => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ sessionId, messages, companionType, mood, imageBase64, customInstructions })
  });
  if (!response.ok) {
    throw new Error('Failed to send chat message');
  }
  return response.json();
};

export const getChatHistory = async () => {
  const response = await fetch(`${API_BASE}/chat/history`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  return response.json();
};

export const getChatSessions = async () => {
  const response = await fetch(`${API_BASE}/chat/sessions`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch chat sessions');
  return response.json();
};

export const createChatSession = async (title = 'New Chat') => {
  const response = await fetch(`${API_BASE}/chat/sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title })
  });
  if (!response.ok) throw new Error('Failed to create chat session');
  return response.json();
};

export const getSessionHistory = async (sessionId) => {
  const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}/history`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch session history');
  return response.json();
};
