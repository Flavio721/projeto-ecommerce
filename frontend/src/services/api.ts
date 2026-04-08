import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // necessário para enviar o cookie do refreshToken
});

// Interceptor — injeta o accessToken em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor — trata token expirado automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Se receber 401 e ainda não tentou renovar o token
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Tenta renovar o accessToken usando o refreshToken do cookie
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("accessToken", data.accessToken);

        // Refaz a requisição original com o novo token
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        // Refresh falhou — redireciona para login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;