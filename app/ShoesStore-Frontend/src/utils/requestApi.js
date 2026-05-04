import axios from "axios";

// Đọc URL API từ biến môi trường (React sẽ tự động phân giải tùy theo môi trường build dev/prod)
// Nếu không cấu hình, có thể fallback về window.location.hostname
const getApiUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  const hostname = window.location.hostname;

  // Nếu đang dev local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://localhost:7102/api/';
  }

  // Nếu truy cập qua domain (K8s Ingress) - dùng relative path
  if (!hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return '/api/';
  }

  // Nếu truy cập qua IP (VM hoặc K8s NodePort)
  return `https://${hostname}:7102/api/`;
};

const requestApi = axios.create({
  baseURL: getApiUrl()
});

export default requestApi;

