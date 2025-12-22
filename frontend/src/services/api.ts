import axios, { AxiosInstance, AxiosError } from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('campus_lf_token');
          localStorage.removeItem('campus_lf_user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  getGoogleAuthUrl(role: string) {
    return `${BACKEND_URL}/auth/google?role=${role}`;
  }

  // Items endpoints
  async getItems(collegeId: string, params?: { status?: string; societyId?: string }) {
    const response = await this.client.get(`/items`, { params: { collegeId, ...params } });
    return response.data;
  }

  async getItem(id: string) {
    const response = await this.client.get(`/items/${id}`);
    return response.data;
  }

  async createItem(data: {
    title: string;
    description: string;
    category: string;
    status: 'lost' | 'found';
    location: string;
    date: string;
    image?: string;
    collegeId: string;
    societyId?: string;
  }) {
    const response = await this.client.post('/items', data);
    return response.data;
  }

  async updateItem(id: string, data: Partial<{
    title: string;
    description: string;
    status: string;
    isResolved: boolean;
  }>) {
    const response = await this.client.patch(`/items/${id}`, data);
    return response.data;
  }

  async deleteItem(id: string) {
    const response = await this.client.delete(`/items/${id}`);
    return response.data;
  }

  async claimItem(id: string) {
    const response = await this.client.post(`/items/${id}/claim`);
    return response.data;
  }

  // College endpoints
  async getCollege(id: string) {
    const response = await this.client.get(`/colleges/${id}`);
    return response.data;
  }

  async getCollegeStats(id: string) {
    const response = await this.client.get(`/colleges/${id}/stats`);
    return response.data;
  }

  async generateInviteCode(collegeId: string, type: 'society' | 'college') {
    const response = await this.client.post(`/colleges/${collegeId}/invite-codes`, { type });
    return response.data;
  }

  // Society endpoints
  async getSociety(id: string) {
    const response = await this.client.get(`/societies/${id}`);
    return response.data;
  }

  async getSocietyItems(societyId: string) {
    const response = await this.client.get(`/societies/${societyId}/items`);
    return response.data;
  }

  // User endpoints
  async getUserItems(userId: string) {
    const response = await this.client.get(`/users/${userId}/items`);
    return response.data;
  }

  async updateProfile(data: Partial<{ name: string; avatar: string }>) {
    const response = await this.client.patch('/users/profile', data);
    return response.data;
  }

  // Admin endpoints
  async getPendingItems(collegeId: string) {
    const response = await this.client.get(`/admin/${collegeId}/pending-items`);
    return response.data;
  }

  async approveItem(collegeId: string, itemId: string) {
    const response = await this.client.post(`/admin/${collegeId}/items/${itemId}/approve`);
    return response.data;
  }

  async rejectItem(collegeId: string, itemId: string) {
    const response = await this.client.post(`/admin/${collegeId}/items/${itemId}/reject`);
    return response.data;
  }

  async resolveItem(collegeId: string, itemId: string) {
    const response = await this.client.post(`/admin/${collegeId}/items/${itemId}/resolve`);
    return response.data;
  }

  async getAnalytics(collegeId: string) {
    const response = await this.client.get(`/admin/${collegeId}/analytics`);
    return response.data;
  }
}

export const api = new ApiService();
