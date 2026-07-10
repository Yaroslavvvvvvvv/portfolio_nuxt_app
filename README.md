# Obsigma — Studio Site + Admin

Сайт веб-студії: публічна SSR-частина (SEO) + власна адмін-панель (`/admin`, SPA).
Nuxt 4 · Nitro · PostgreSQL + Prisma · PrimeVue · i18n (uk/en).

- **[PROJECT.md](./PROJECT.md)** — архітектура, модель даних, роадмап.
- **[DEPLOY.md](./DEPLOY.md)** — деплой у прод, SEO та аналітика.

## Вимоги

- Node.js 20+
- PostgreSQL 16 (локально: `brew services start postgresql@16`)

## Запуск

```bash
npm install

cp .env.example .env     # заповнити DATABASE_URL, NUXT_SESSION_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD

npm run db:migrate       # prisma migrate dev
npm run db:seed          # адмін + демо-контент

npm run dev              # → http://localhost:3000
```

- Публічний сайт — `http://localhost:3000/`
- Адмінка — `http://localhost:3000/admin` (креденшли з `.env`)

## Скрипти

| Команда | Що робить |
|---|---|
| `npm run dev` | dev-сервер |
| `npm run build` / `npm run preview` | прод-білд і локальний перегляд |
| `npm test` | vitest |
| `npm run db:migrate` | застосувати міграції (dev) |
| `npm run db:seed` | сид: адмін + демо-контент |
| `npm run db:studio` | Prisma Studio |

## Додати новий ресурс в адмінку

CRUD — config-driven, нових роутів і сторінок писати не треба:

1. Модель у `prisma/schema.prisma` + `npm run db:migrate`.
2. Конфіг у `app/config/resources/<name>.ts` + рядок у `app/config/resources/index.ts`.
3. Запис у `server/utils/resources.ts` (`crudRegistry`) і, якщо ресурс публічний, у `server/utils/publicResources.ts`.

Сайдбар, таблиця, форма і API-роути підхоплять його автоматично.

### Типи полів форми

| `type` | Компонент | Нотатки |
|---|---|---|
| `text` / `number` | `AppFieldInput` | |
| `textarea` | `AppFieldTextarea` | |
| `boolean` | `AppFieldSwitch` | |
| `list` | `AppFieldInput` | значення через кому → масив |
| `image` | `AppFieldImage` | upload + прев'ю; шлях лишається редагованим текстом |
| `richtext` | `AppFieldEditor` | Quill; картинки йдуть в сховище, не в base64 |

SEO-поля (`metaTitle` / `metaDescription` / `ogImage`) підключаються одним спредом:
`...seoFields` з `app/config/resources/seo.ts`.

## Бренд-асети

Лежать у `public/`, підключені через `app.head` у `nuxt.config.ts`:

| Файл | Для чого |
|---|---|
| `favicon.ico`, `favicon-96x96.png` | вкладка браузера |
| `apple-touch-icon.png` | іконка на домашньому екрані iOS |
| `web-app-manifest-192x192.png`, `-512x512.png` | PWA, через `site.webmanifest` |
| `og-default.png` (1200×630) | прев'ю в соцмережах для сторінок без власної картинки |

`og:image` береться так: `ogImage` запису → його `imagePath` → `og-default.png`.
Замінюючи будь-який файл, лишайте ім'я — код чіпати не треба.

⚠️ `site.webmanifest` навмисно **без** `"purpose": "maskable"`: у знака немає безпечної зони,
Android зрізав би кути ромба. Додати можна лише разом із версією, де знак вписаний у центральні 80%.

## Завантаження зображень

Локально файли лягають у `.data/uploads` і віддаються через `/uploads/*`.
У проді — S3-сумісне сховище (`NUXT_STORAGE_DRIVER=s3`), бо диск контейнера ефемерний.
Деталі й змінні — у [DEPLOY.md](./DEPLOY.md).

## Прод

`npm run build` → `node .output/server/index.mjs`.
Міграції на релізі — `npx prisma migrate deploy` (не `migrate dev`). Деталі — у [DEPLOY.md](./DEPLOY.md).
