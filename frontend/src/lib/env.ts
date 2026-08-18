interface Env {
  API_URL: string;
  API_PREFIX: string;
  SOCKET_URL: string;
  APP_NAME: string;
  API_BASE: string;
}

export const env: Env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3012",
  API_PREFIX: import.meta.env.VITE_API_PREFIX || "/api/v1",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:3012",
  APP_NAME: import.meta.env.VITE_APP_NAME || "E-Gov Portal",
  get API_BASE() {
    return `${this.API_URL}${this.API_PREFIX}`;
  },
};
