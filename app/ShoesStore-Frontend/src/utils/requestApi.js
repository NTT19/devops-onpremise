import axios from "axios";

// Tự động phát hiện API URL dựa trên hostname
const getApiUrl = () => {
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

