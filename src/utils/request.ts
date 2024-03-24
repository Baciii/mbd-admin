import axios, { AxiosRequestConfig } from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';
import router from '../router/index.ts';

const service = axios.create({
    baseURL: import.meta.env.VITE_HOST,
    timeout: 30000
});

service.interceptors.request.use(
    (config) => {
        // console.log(config.url);
        // 鉴权Header
        if (localStorage.getItem('TOKEN')) {
            (config.headers as any)['Authorization'] =
                'Bearer ' + localStorage.getItem('TOKEN');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        const { data = {}, code = 0, message } = response?.data || {};

        if (response?.status === 401) {
            router.push({
                name: 'login'
            });
        }

        if (+code === 0) {
            return data || {};
        } else {
            // 全局提示
            MessagePlugin.error({
                content: message
            });

            return Promise.reject(response?.data || {});
        }
    },
    (error = {}) => {
        const { response = {} } = error || {};

        if (response?.status === 401) {
            router.push({
                name: 'login'
            });
        }

        MessagePlugin.error({
            content: response?.data?.message || 'Network Error'
        });
        return Promise.reject(response?.data || {});
    }
);

export default service;

export function request<T, R>(config: AxiosRequestConfig<T>): Promise<R> {
    return service(config) as unknown as Promise<R>;
}
