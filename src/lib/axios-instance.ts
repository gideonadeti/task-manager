import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
});

// Request interceptor to add access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired access token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, refresh it
    if (
      error.response?.status === 401 &&
      error.response?.data.errors &&
      error.response.data.errors[0].message === "Access token has expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const { data } = await axiosInstance.post("auth/refresh-token", {
          refreshToken,
        });

        localStorage.setItem("accessToken", data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (error) {
        console.error("Refresh token failed:", error);

        if (error instanceof AxiosError && error.response?.status === 403) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          window.location.href = "/auth/sign-in";
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
