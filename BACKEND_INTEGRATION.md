# Backend Integration

Frontend Next.js sudah disambungkan ke Django API di `lib/api.ts`. Endpoint base diambil dari `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:8000/api`).

## Setup

```powershell
cp .env.local.example .env.local
npm install
npm run dev
```

Pastikan backend Django berjalan di port 8000:
```powershell
cd ../iofest-be
.\.venv\Scripts\python.exe manage.py runserver 8000
```

## Halaman yang sudah live (pakai API)

| Route | API yang dipanggil |
|---|---|
| `/auth/login` | `POST /api/auth/login` |
| `/auth/register` | `POST /api/auth/register` → `POST /api/auth/verify-otp` |
| `/issues` | `GET /api/issues/` (filter status, kategori, scope, q, sort) |
| `/issues/[slug]` | `GET /api/issues/{slug}/` + `GET /api/issues/{slug}/stances` + `GET/POST /api/issues/{slug}/clusters` + `GET /api/issues/{slug}/policy-brief` + `GET /api/ai/issues/{slug}/legal-context` + `POST /api/issues/{slug}/stances/{id}/vote` |
| `/forum` | `GET /api/forum/threads` |
| `/forum/[slug]` | `GET/POST /api/forum/threads/{slug}` + bookmark |
| `/gov` | `GET /api/issues/` + `PATCH /api/issues/{slug}/status/` |

| `/hukum` | `GET /api/laws/` (filter `type`, `status`, `q`) |
| `/forum/new` | `POST /api/forum/threads` |
| `/forum/bookmarks` | `GET /api/forum/bookmarks` + auto-cleanup via `DELETE /api/forum/threads/{slug}/bookmark` |
| Tab "Berita Terkait" di issue detail | `GET /api/news?q={issue.title}` (NewsAPI proxy yang sudah ada) |

Halaman yang masih mock / belum diwire:
- `/hukum/[code]` — detail peraturan (route belum ada). Endpoint backend sudah siap di `GET /api/laws/{code}`.
- `/news/[slug]` — detail berita masih NewsAPI lokal.

## Auth flow

`AuthProvider` (`lib/auth-context.tsx`) membungkus seluruh app via `app/layout.tsx`. Pakai hook `useAuth()`:

```tsx
const { user, loading, login, logout, register, verifyOtp } = useAuth();
```

Token disimpan di `localStorage` dengan key `sk_access` & `sk_refresh`. Auto-refresh bila access token expired (handler di `apiRequest`).

## Login dev cepat

Setelah seed backend:
- Email: `sari@suarakita.id` (PAKAR)
- Email: `rina@suarakita.id` (PEJABAT — bisa lihat dasbor `/gov`)
- Password (semua user): `password123`

## Yang masih perlu di-rewire frontend (untuk prompt selanjutnya)

1. `/hukum` — perlu endpoint backend `/api/laws/` untuk daftar peraturan, atau tetap pakai static data lokal.
2. `/forum/new` — wire form ke `forum.create()`.
3. `/forum/bookmarks` — wire ke `forum.myBookmarks()`.
4. `/news/[slug]` — saat ini fetch dari NewsAPI; bisa tetap.
5. Issue detail tab "Berita Terkait" — bisa pakai `/api/news?q={issue.title}` yang sudah ada.
6. Dasbor `/gov` — banner stats hardcoded (`STATISTICS`); bisa diganti pakai aggregator endpoint baru atau dihitung dari list.
7. Notifications/realtime — kalau mau peta opini auto-update, perlu polling atau WebSocket.
