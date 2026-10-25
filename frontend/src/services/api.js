// src/services/api.js
const BASE_URL = '';

const API = {
  get: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw { response: { data: error } };
    }
    const data = await res.json();
    return { data };
  },

  post: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw { response: { data: error } };
    }
    const data = await res.json();
    return { data };
  },

  put: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw { response: { data: error } };
    }
    const data = await res.json();
    return { data };
  },

  delete: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw { response: { data: error } };
    }
    const data = await res.json();
    return { data };
  },
};

export default API;