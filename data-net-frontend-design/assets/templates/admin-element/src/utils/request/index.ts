import axios, { type AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';

/**
 * HTTP 请求封装骨架。
 * - baseURL 从 VITE_API_PREFIX 读取(经 vite proxy 转发到后端)
 * - 401/403 等可在拦截器里跳登录页(按需补充)
 * - 约定后端返回 { code, data, message },code !== 200 视为业务错误
 *
 * 用法:import { http } from '@/utils/request';
 *       const { data } = await http.get('/user/list', { params });
 */
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX || '/prod-api',
    timeout: 30000,
});

service.interceptors.request.use(
    (config) => {
        // 在此注入 token(从 localStorage / sessionStorage / pinia 取)
        // const token = localStorage.getItem('token')
        // if (token) config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => Promise.reject(error),
);

service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res && typeof res === 'object' && 'code' in res) {
            if (res.code === 200) return res;
            ElMessage.error(res.message || '请求失败');
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            // 未授权:清登录态,跳登录页
            // location.href = '/login'
        }
        ElMessage.error(error.response?.data?.message || error.message || '网络异常');
        return Promise.reject(error);
    },
);

export const http = service;
