import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigurasi skenario pengujian beban (load testing)
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up ke 20 pengguna virtual (VUs)
    { duration: '1m', target: 20 },  // Menjaga beban puncak pada 20 VUs
    { duration: '30s', target: 0 },  // Ramp-down kembali ke 0 VUs
  ],
  thresholds: {
    // Toleransi kegagalan request kurang dari 1%
    http_req_failed: ['rate<0.01'], 
    // 95% request harus selesai di bawah 1 detik (1000ms)
    http_req_duration: ['p(95)<1000'], 
  },
};

// URL Dasar server pengujian (dapat diubah melalui environment variable)
const BASE_URL = __ENV.BASE_URL || 'http://cafinity-app-laravel.test';

/**
 * Setup Phase: Dijalankan sekali di awal pengujian.
 * Berguna untuk melakukan autentikasi dan membagikan token JWT/Sanctum ke setiap VU.
 */
export function setup() {
  const loginUrl = `${BASE_URL}/api/auth/login`;
  const payload = JSON.stringify({
    email: 'budi.s@smartcafe.id',
    password: 'password',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const response = http.post(loginUrl, payload, params);

  const success = check(response, {
    'Setup login berhasil (200)': (res) => res.status === 200,
    'Setup mengembalikan auth token': (res) => res.json().token !== undefined,
  });

  if (!success) {
    console.error('Setup gagal masuk (auth login failed). Response: ' + response.body);
    throw new Error('Autentikasi setup gagal');
  }

  return { token: response.json().token };
}

/**
 * VU (Virtual User) Phase: Skenario yang dijalankan berulang kali secara paralel
 * oleh setiap Virtual User selama pengujian berlangsung.
 */
export default function (data) {
  const token = data.token;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  // Skenario 1: Mengakses Dashboard Utama
  const dashboardRes = http.get(`${BASE_URL}/api/dashboard`, params);
  check(dashboardRes, {
    'akses dashboard berstatus 200': (r) => r.status === 200,
  });
  sleep(1); // Simulasi waktu baca pengguna (think time) 1 detik

  // Skenario 2: Mengakses Katalog Menu Cafe
  const menusRes = http.get(`${BASE_URL}/api/menus`, params);
  check(menusRes, {
    'akses katalog menu berstatus 200': (r) => r.status === 200,
  });
  sleep(1.5); // Think time 1.5 detik

  // Skenario 3: Mengakses Manajemen Inventaris Stok
  const inventoriesRes = http.get(`${BASE_URL}/api/inventories`, params);
  check(inventoriesRes, {
    'akses inventaris berstatus 200': (r) => r.status === 200,
  });
  sleep(1);

  // Skenario 4: Mengakses Laporan Bisnis
  const reportsRes = http.get(`${BASE_URL}/api/reports`, params);
  check(reportsRes, {
    'akses laporan berstatus 200': (r) => r.status === 200,
  });
  sleep(2);
}
