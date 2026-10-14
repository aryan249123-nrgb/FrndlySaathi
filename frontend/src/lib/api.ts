import { AuthResponse, Contract, Notification, Payment, Project, Proposal, User } from '@/types';

const API_BASE = 'http://localhost:8080/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('fs_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = data?.message || data?.errors 
      ? (typeof data.errors === 'object' ? Object.values(data.errors).join(', ') : data.message)
      : `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse<AuthResponse>(res);
    },

    register: async (data: { name: string; email: string; password: string; role: 'CLIENT' | 'FREELANCER' }): Promise<User> => {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<User>(res);
    },

    getMe: async (): Promise<User> => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<User>(res);
    },
  },

  projects: {
    getAll: async (category?: string, search?: string): Promise<Project[]> => {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search && search.trim()) params.append('search', search.trim());
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE}/projects${query}`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Project[]>(res);
    },

    getById: async (id: number): Promise<Project> => {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Project>(res);
    },

    getMyProjects: async (): Promise<Project[]> => {
      const res = await fetch(`${API_BASE}/projects/my-projects`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Project[]>(res);
    },

    create: async (data: {
      title: string;
      description: string;
      budget: number;
      deadline?: string;
      category?: string;
      skillsRequired?: string;
    }): Promise<Project> => {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      return handleResponse<Project>(res);
    },

    delete: async (id: number): Promise<void> => {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete project: ${res.statusText}`);
      }
    },
  },

  proposals: {
    submit: async (projectId: number, data: { coverLetter: string; bidAmount: number; estimatedDays: number }): Promise<Proposal> => {
      const res = await fetch(`${API_BASE}/projects/${projectId}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      return handleResponse<Proposal>(res);
    },

    getByProject: async (projectId: number): Promise<Proposal[]> => {
      const res = await fetch(`${API_BASE}/projects/${projectId}/proposals`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Proposal[]>(res);
    },

    getMyProposals: async (): Promise<Proposal[]> => {
      const res = await fetch(`${API_BASE}/proposals/my-proposals`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Proposal[]>(res);
    },

    accept: async (id: number): Promise<Proposal> => {
      const res = await fetch(`${API_BASE}/proposals/${id}/accept`, {
        method: 'PUT',
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Proposal>(res);
    },

    reject: async (id: number): Promise<Proposal> => {
      const res = await fetch(`${API_BASE}/proposals/${id}/reject`, {
        method: 'PUT',
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Proposal>(res);
    },
  },

  contracts: {
    getUserContracts: async (): Promise<Contract[]> => {
      const res = await fetch(`${API_BASE}/contracts`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Contract[]>(res);
    },

    getById: async (id: number): Promise<Contract> => {
      const res = await fetch(`${API_BASE}/contracts/${id}`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Contract>(res);
    },

    complete: async (id: number): Promise<Contract> => {
      const res = await fetch(`${API_BASE}/contracts/${id}/complete`, {
        method: 'PUT',
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Contract>(res);
    },
  },

  payments: {
    process: async (data: {
      contractId: number;
      amount: number;
      paymentMethod: 'CARD' | 'UPI' | 'WALLET';
      userTier?: 'STANDARD' | 'PREMIUM';
    }): Promise<Payment> => {
      const res = await fetch(`${API_BASE}/payments/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      return handleResponse<Payment>(res);
    },

    getForContract: async (contractId: number): Promise<Payment[]> => {
      const res = await fetch(`${API_BASE}/payments/contract/${contractId}`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Payment[]>(res);
    },

    getMyPayments: async (): Promise<Payment[]> => {
      const res = await fetch(`${API_BASE}/payments/my-payments`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Payment[]>(res);
    },
  },

  notifications: {
    getAll: async (): Promise<Notification[]> => {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Notification[]>(res);
    },

    getUnreadCount: async (): Promise<number> => {
      const res = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers: { ...getAuthHeader() },
      });
      const data = await handleResponse<{ unreadCount: number }>(res);
      return data.unreadCount;
    },

    markAsRead: async (id: number): Promise<Notification> => {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { ...getAuthHeader() },
      });
      return handleResponse<Notification>(res);
    },

    markAllAsRead: async (): Promise<void> => {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { ...getAuthHeader() },
      });
      await handleResponse<{ message: string }>(res);
    },
  },
};
