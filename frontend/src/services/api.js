const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Never send a (possibly stale) token to the public login/register endpoints
  const isAuthCall =
    endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');

  const token = localStorage.getItem('vc_token');
  if (token && !isAuthCall) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    // Server rejected our token: drop it so the next request goes out clean
    if (response.status === 401 && !isAuthCall) {
      localStorage.removeItem('vc_token');
      localStorage.removeItem('vc_user');
    }

    if (!response.ok) {
      let errorMessage = 'Request failed';
      if (data) {
        if (typeof data === 'string') errorMessage = data;
        else if (data.detail) errorMessage = data.detail;
        else if (data.message) errorMessage = data.message;
        else {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const val = data[firstKey];
            errorMessage = Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`;
          }
        }
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${url}:`, err);
    throw err;
  }
}

export const api = {
  venues: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.location) query.set('location', params.location);
      if (params.category) query.set('category', params.category);
      if (params.min_price) query.set('min_price', params.min_price);
      if (params.max_price) query.set('max_price', params.max_price);
      if (params.search) query.set('search', params.search);
      const qs = query.toString();
      return request(`/venues/${qs ? `?${qs}` : ''}`);
    },

    getById: async (id) => {
      const cleanId = String(id).replace(/^v/, '');
      return request(`/venues/${cleanId}/`);
    },

    create: async (venueData) => {
      return request('/venues/', {
        method: 'POST',
        body: JSON.stringify(venueData)
      });
    },

    update: async (id, venueData) => {
      const cleanId = String(id).replace(/^v/, '');
      return request(`/venues/${cleanId}/`, {
        method: 'PATCH',
        body: JSON.stringify(venueData)
      });
    },

    delete: async (id) => {
      const cleanId = String(id).replace(/^v/, '');
      return request(`/venues/${cleanId}/`, {
        method: 'DELETE'
      });
    },

    approve: async (id) => {
      const cleanId = String(id).replace(/^v/, '');
      return request(`/venues/${cleanId}/approve/`, {
        method: 'POST'
      });
    },

    suspend: async (id) => {
      const cleanId = String(id).replace(/^v/, '');
      return request(`/venues/${cleanId}/suspend/`, {
        method: 'POST'
      });
    },

    getRecommendations: async (criteria = {}) => {
      return request('/venues/recommend/', {
        method: 'POST',
        body: JSON.stringify(criteria)
      });
    }
  },

  bookings: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/bookings/${query ? `?${query}` : ''}`);
    },

    getById: async (id) => {
      const cleanId = String(id).replace(/^b/, '');
      return request(`/bookings/${cleanId}/`);
    },

    create: async (bookingData) => {
      return request('/bookings/', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    },

    cancel: async (id) => {
      const cleanId = String(id).replace(/^b/, '');
      return request(`/bookings/${cleanId}/cancel/`, {
        method: 'POST'
      });
    },

    confirm: async (id) => {
      const cleanId = String(id).replace(/^b/, '');
      return request(`/bookings/${cleanId}/confirm/`, {
        method: 'POST'
      });
    },

    decline: async (id) => {
      const cleanId = String(id).replace(/^b/, '');
      return request(`/bookings/${cleanId}/decline/`, {
        method: 'POST'
      });
    }
  },

  notifications: {
    getAll: async () => {
      return request('/notifications/');
    },

    markRead: async (id) => {
      return request(`/notifications/${id}/mark_read/`, {
        method: 'POST'
      });
    },

    markAllRead: async () => {
      return request('/notifications/mark_all_read/', {
        method: 'POST'
      });
    }
  },

  auth: {
    register: async (userData) => {
      const res = await request('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res?.tokens?.access) {
        localStorage.setItem('vc_token', res.tokens.access);
        localStorage.setItem('vc_user', JSON.stringify(res.user));
      }
      return res;
    },

    login: async (credentials) => {
      const res = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (res?.tokens?.access) {
        localStorage.setItem('vc_token', res.tokens.access);
        localStorage.setItem('vc_user', JSON.stringify(res.user));
      }
      return res;
    },

    getMe: async () => {
      return request('/auth/me/');
    },

    logout: () => {
      localStorage.removeItem('vc_token');
      localStorage.removeItem('vc_user');
    },

    getCurrentUser: () => {
      try {
        const u = localStorage.getItem('vc_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    }
  },

  users: {
    getAll: async () => {
      return request('/users/');
    },

    toggleStatus: async (id) => {
      const cleanId = String(id).replace(/^u/, '');
      return request(`/users/${cleanId}/toggle_status/`, {
        method: 'POST'
      });
    }
  }
};

export default api;
