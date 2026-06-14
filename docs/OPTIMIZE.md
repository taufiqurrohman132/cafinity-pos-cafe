Buatkan file PERFORMANCE_OPTIMIZATION.md di root project ini yang berisi panduan optimasi performa bertahap untuk SaaS café management system Cafinity.

Struktur README harus mencakup:

1. OVERVIEW
   - Baseline performa sebelum optimasi (p95: 14.78s, avg: 11.23s, 1.23 req/s)
   - Target performa SaaS (p95: <500ms, avg: <200ms, 500+ concurrent users)
   - Progress yang sudah dicapai (p95: ~7s, avg: ~4s, 2.5 req/s)

2. PHASE 1 - FOUNDATION (sudah sebagian done)
   Setiap item harus ada:
   - Deskripsi masalah
   - Langkah fix spesifik dengan kode
   - Cara verifikasi
   - Expected improvement
   
   Items:
   - [x] Nginx + PHP-FPM setup (done)
   - [x] PHP worker increase ke 10 (done)
   - [x] Query optimization - hapus duplikasi hppChart (done)
   - [x] estimateHpp pakai DB join (done)
   - [x] profitabilityAnalysis dengan Cache::remember (done)
   - [x] OPcache activation di php.ini
   - [x] Redis installation dan konfigurasi
   - [x] Queue untuk async jobs (notifikasi, audit log)
   - [x] npm run build untuk production assets
   - [x] Database indexes migration
   - [x] Gzip compression di Nginx

3. PHASE 2 - ARCHITECTURE
   - [x] Multi-tenancy implementation
   - [x] API rate limiting per tenant
   - [x] Sanctum token expiration optimization
   - [x] Response pagination enforcement
   - [x] Select specific columns (hindari SELECT *)

4. PHASE 3 - SCALE
   - [ ] Read replica database setup
   - [ ] Horizontal scaling PHP-FPM
   - [ ] Load balancer configuration
   - [ ] CDN setup (Cloudflare)
   - [ ] Docker containerization

5. PHASE 4 - MONITORING
   - [ ] Laravel Telescope setup
   - [ ] Sentry error tracking
   - [ ] k6 load testing scripts (sudah ada di tests/Performance/)
   - [ ] Grafana + Prometheus metrics
   - [ ] Uptime monitoring

6. CARA PAKAI README INI DENGAN AI AGENT
   - Instruksi cara eksekusi per phase menggunakan Claude Code
   - Template prompt untuk setiap phase
   - Cara verifikasi setelah setiap phase selesai

7. BENCHMARK RESULTS
   - Tabel perbandingan sebelum/sesudah setiap optimasi
   - Command k6 untuk rerun benchmark

Format: Markdown dengan checkbox, code blocks, dan tabel yang jelas.
Bahasa: Indonesia.