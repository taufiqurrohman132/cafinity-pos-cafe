import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

let activeRequests = 0;

function startProgress() {
    if (activeRequests === 0) {
        NProgress.start();
    }
    activeRequests++;
}

function stopProgress() {
    activeRequests--;
    if (activeRequests <= 0) {
        activeRequests = 0;
        NProgress.done();
    }
}

const client = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor: Attach Token & Start Progress
client.interceptors.request.use(
    (config) => {
        startProgress();
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        stopProgress();
        return Promise.reject(error);
    }
);

// Response Interceptor: Stop Progress & Handle Token Expiration (401)
client.interceptors.response.use(
    (response) => {
        stopProgress();
        return response;
    },
    (error) => {
        stopProgress();
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to login page if we are not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
