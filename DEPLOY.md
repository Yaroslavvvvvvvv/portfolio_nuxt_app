# Deploy & SEO — нотатки на потім

Довідник по деплою в прод і SEO/аналітиці. Складено до першого деплою — переглянути, коли дійде до релізу.

## Що за застосунок (важливо для вибору хостингу)

SSR + Nitro (Node) + PostgreSQL + Prisma + сесійна auth (nuxt-auth-utils).

- **Статичний хостинг НЕ підходить** — потрібен живий Node-процес і база даних.
- Один Nuxt-деплой обслуговує і публічний сайт (SSR), і `/admin` (SPA).

---

## Деплой

### Варіанти (від найпростішого)

| Платформа | Плюси | Мінуси | Кому |
|---|---|---|---|
| **Render / Railway** ⭐ | git-push деплой, Node + Postgres в одному місці, HTTPS з коробки, без Docker/Nginx | ~$7–15/міс, менше контролю | solo frontend, реальний проект |
| **VPS** (Hetzner / DigitalOcean) | найдешевше ($4–6/міс), повний контроль | сам ставиш Node, Postgres, Nginx, HTTPS, systemd | коли захочеться контроль/масштаб |
| **Vercel / Netlify** | найлегший деплой Nuxt | serverless + Prisma = cold-start і проблеми з конекшенами до БД; базу все одно окремо (Neon) | НЕ раджу для цього стека |

**Рекомендація: Render або Railway.** Під'єднати GitHub-репо (`Yaroslavvvvvvvv/portfolio_nuxt_app`) → авто-білд і деплой на кожен push. Postgres — їхній managed (без Homebrew, без Docker).

### Кроки деплою (будь-де)

1. `npm run build` → `.output/` (білд перевірено — чистий).
2. Запуск: `node .output/server/index.mjs` (Render/Railway роблять самі).
3. **Env-змінні** в панелі хостингу (НЕ в git):
   - `DATABASE_URL`
   - `NUXT_SESSION_PASSWORD`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `NUXT_PUBLIC_SITE_URL` — реальний домен, напр. `https://studio.com` (без слеша в кінці)
4. **Міграції БД:** `npx prisma migrate deploy` як release-команда (⚠️ НЕ `migrate dev`).
5. HTTPS + домен — Render/Railway автоматично; на VPS — Caddy/Nginx + Let's Encrypt.

### ⚠️ Image upload — ОБОВʼЯЗКОВО перемкнути на S3 у проді

Локальна ФС на Render/Railway **ефемерна** — файли зникають при редеплої.
Драйвер сховища вже абстраговано (`server/utils/storage.ts`), лишається задати env:

```
NUXT_STORAGE_DRIVER=s3
NUXT_STORAGE_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
NUXT_STORAGE_S3_BUCKET=studio-uploads
NUXT_STORAGE_S3_ACCESS_KEY_ID=…
NUXT_STORAGE_S3_SECRET_ACCESS_KEY=…
NUXT_STORAGE_S3_PUBLIC_URL=https://cdn.example.com   # публічний домен бакета
```

- **Cloudflare R2** (безкоштовний вихідний трафік) — рекомендація, або Backblaze B2.
- Якщо лишити `local`, картинки зникнуть при першому ж редеплої.
- ⚠️ S3-драйвер написано під R2/B2 (підпис через `aws4fetch`), але **на реальному бакеті ще не перевірявся** — протестувати при першому деплої.
- Ліміт завантаження 5 МБ, дозволені JPEG/PNG/WebP/GIF/AVIF; SVG заборонено свідомо (може нести `<script>`).

---

## SEO та аналітика

SEO для цього проекту критичне. Розділено на обов'язкове й опціональне.

### 🔴 Must (SEO-фундамент)

- **Google Search Console** — індексація, помилки, сабміт sitemap. Безкоштовно. ← лишилось зробити після деплою.
- ✅ **sitemap.xml + robots.txt** — `@nuxtjs/sitemap` + `@nuxtjs/robots` підключені.
- ✅ **OG / Twitter meta + JSON-LD** — композабл `usePageSeo` / `useJsonLd` (`app/composables/useSeo.ts`).

⚠️ **Обовʼязково задати `NUXT_PUBLIC_SITE_URL`** в env хостингу — це origin для canonical, `og:image` і `sitemap.xml`.
Без неї в прод поїде `http://localhost:3000` у всіх канонікалах. Тепер це б'є **кожну** сторінку, а не лише ті,
що мають власну картинку: `og:image` має дефолт (`/og-default.png`), і він теж абсолютизується від `site.url`.

### 🟡 Optional (аналітика трафіку)

- **Google Analytics 4** — трафік/конверсії, але тягне cookie-consent (GDPR в ЄС).
- **Приватніша альтернатива:** **Plausible** або **Umami** (self-hosted) — без cookie-банера, легші, точніші для малого сайту. Для студії виглядає солідніше.

---

## Порядок дій

1. **Зараз / до деплою:** SEO-фундамент (`@nuxtjs/sitemap`, `@nuxtjs/robots`, повні OG-meta + JSON-LD) — продовження роботи з titles.
2. **На деплої:** обрати платформу (Render/Railway vs VPS), завести домен, env-змінні, `migrate deploy`.
3. **Після:** аналітика (GA4 або Plausible) — коли є домен.
4. **З image upload:** підключити R2/B2 замість локальної ФС.
