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
4. **Міграції БД:** `npx prisma migrate deploy` як release-команда (⚠️ НЕ `migrate dev`).
5. HTTPS + домен — Render/Railway автоматично; на VPS — Caddy/Nginx + Let's Encrypt.

### ⚠️ Image upload (майбутня фіча роадмапу)

Локальна ФС на Render/Railway **ефемерна** — файли зникають при редеплої.
Картинки класти в **S3-сумісне сховище**:
- **Cloudflare R2** (безкоштовний вихідний трафік) — рекомендація
- або Backblaze B2

Врахувати при реалізації завантаження зображень.

---

## SEO та аналітика

SEO для цього проекту критичне. Розділено на обов'язкове й опціональне.

### 🔴 Must (SEO-фундамент)

- **Google Search Console** — індексація, помилки, сабміт sitemap. Безкоштовно.
- **sitemap.xml + robots.txt** — модулі `@nuxtjs/sitemap` + `@nuxtjs/robots` (~5 хв).
- **OG / Twitter meta + JSON-LD** (structured data) — прев'ю в соцмережах, rich-результати Google.
  - База вже є: `useSeoMeta` з `title` на всіх публічних сторінках + глобальний `titleTemplate '%s · Starter'` в `app.vue`.
  - Додати: `og:image`, `description` на кожну сторінку, JSON-LD для організації/статей.

### 🟡 Optional (аналітика трафіку)

- **Google Analytics 4** — трафік/конверсії, але тягне cookie-consent (GDPR в ЄС).
- **Приватніша альтернатива:** **Plausible** або **Umami** (self-hosted) — без cookie-банера, легші, точніші для малого сайту. Для студії виглядає солідніше.

---

## Порядок дій

1. **Зараз / до деплою:** SEO-фундамент (`@nuxtjs/sitemap`, `@nuxtjs/robots`, повні OG-meta + JSON-LD) — продовження роботи з titles.
2. **На деплої:** обрати платформу (Render/Railway vs VPS), завести домен, env-змінні, `migrate deploy`.
3. **Після:** аналітика (GA4 або Plausible) — коли є домен.
4. **З image upload:** підключити R2/B2 замість локальної ФС.
