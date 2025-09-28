const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add request timeout and better error handling
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please check if the server is running');
    }
    throw error;
  }
};

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

interface LoginData {
  user: any;
  accessToken: string;
  refreshToken: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  panNumber?: string;
  phone?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Invalid response from server');
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginData>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      return this.handleResponse<LoginData>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running on http://localhost:5000');
      }
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<LoginData>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      return this.handleResponse<LoginData>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running on http://localhost:5000');
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    return this.handleResponse(response);
  }

  async logout(refreshToken: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ refreshToken })
    });

    return this.handleResponse(response);
  }

  async getProfile(): Promise<ApiResponse<{ user: any }>> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`);
      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Backend server is not running. Please start the server with: npm run server');
      }
      throw error;
    }
  }

  // Tax Form APIs
  async createTaxForm(formData: any): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/tax`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(formData)
    });
    return this.handleResponse(response);
  }

  async getTaxForms(params?: any): Promise<ApiResponse> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetchWithTimeout(`${API_BASE_URL}/tax${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getTaxForm(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/tax/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateTaxForm(id: string, formData: any): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/tax/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(formData)
    });
    return this.handleResponse(response);
  }

  async submitForReview(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/tax/${id}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getTaxSummary(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/tax/${id}/summary`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Document APIs
  async uploadDocument(formData: FormData): Promise<ApiResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await fetchWithTimeout(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  async getDocuments(params?: any): Promise<ApiResponse> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetchWithTimeout(`${API_BASE_URL}/documents${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getDocument(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/documents/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/documents/${id}/download`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to download document');
    }
    
    return response.blob();
  }

  async updateDocument(id: string, data: any): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async deleteDocument(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Notification APIs
  async getNotifications(params?: any): Promise<ApiResponse> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetchWithTimeout(`${API_BASE_URL}/notifications${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async deleteNotification(id: string): Promise<ApiResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
export type { ApiResponse, LoginData, RegisterData };