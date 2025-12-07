// myApp/services/api.ts

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// ==================== AUTO DETECT API URL ====================
// Fungsi untuk auto-detect IP dari Expo Dev Server
const getApiUrl = (): string => {
  // Expo menyimpan IP dev server di Constants
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    const apiUrl = `http://${host}:3000/api`;
    console.log("✅ Auto-detected API URL:", apiUrl);
    return apiUrl;
  }
  
  // Fallback jika tidak ketemu
  console.warn("⚠️ Could not auto-detect IP, using fallback");
  return "http://192.168.18.11:3000/api";
};

// Auto-detect API URL
const API_URL = getApiUrl();

console.log("Using API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor untuk auto-inject token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      // Redirect ke login jika perlu
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },
};

// ==================== ACCOUNT API ====================
export const accountAPI = {
  getAll: async () => {
    const response = await api.get("/accounts");
    return response.data.accounts;
  },

  create: async (data: { name: string; type: string; balance?: number }) => {
    const response = await api.post("/accounts", data);
    return response.data.account;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data.account;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },
};

// ==================== TRANSACTION API ====================
export const transactionAPI = {
  getAll: async (params?: any) => {
    const response = await api.get("/transactions", { params });
    return response.data.transactions;
  },

  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get("/transactions/stats", { params });
    return response.data;
  },

  create: async (data: { type: string; amount: number; description: string; accountId: number; category: string; date?: string }) => {
    const response = await api.post("/transactions", data);
    return response.data.transaction;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.transaction;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default api;