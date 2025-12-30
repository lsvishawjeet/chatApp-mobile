import { Config } from '@/constants/Config';
import axios from 'axios';

export const API_BASE_URL = Config.apiUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: Config.timeout,
});

export default apiClient;