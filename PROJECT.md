# Studio Site + Admin

Сайт веб-студії з власною адмін-панеллю. Референс вигляду й структури — **[overchenko.studio](https://overchenko.studio/)**.

---

## 🎯 Ціль проєкту

Реальний комерційний проєкт: **сайт студії для продажу сайтів**.

- Публічна частина — студійний лендинг (проекти/послуги/команда/блог), що продає послуги.
- Адмінка — клієнт (студія) сам керує всім контентом без розробника.
- **Майбутнє:**
  - 💳 **Оплата** (Stripe) — продаж пакетів/послуг онлайн.
  - 🎨 **Оновлення дизайну** — коли структура усталиться.
  - 🔍 **SEO — критично важливе** (сайт має ранжуватись і приводити клієнтів).

Стратегічно проєкт також є **власним boilerplate** — з нього можна клепати схожі сайти клієнтам (див. generic CRUD-движок).

---

## 🧱 Стек

| Шар | Технологія |
|-----|-----------|
| Фронт | **Nuxt 4** (public SSR + `/admin` SPA) + **PrimeVue** + SCSS (BEM) |
| Бекенд | **Nitro** (`server/api/`) — вбудований у Nuxt, весь TypeScript |
| БД | **PostgreSQL** (локально через Homebrew) + **Prisma** |
| Auth | **nuxt-auth-utils** (сесійна, scrypt-хеш) |
| i18n | **@nuxtjs/i18n** (uk / en) |
| Форми | **AppField**-кіт (перенесений з Complat) + FloatLabel |

**Свідомі рішення:** без окремого Nest-бекенду (Nitro-моноліт вистачає), без Supabase (повний self-contained ownership). Nest додамо, лише якщо логіка переросте Nitro.

---

## 🗂️ Архітектура

```
nuxt-admin-starter/
├── app/                      # фронт
│   ├── pages/                #   public (SSR) + /admin (SPA)
│   ├── components/@core      #   AppField-кіт, theme toggle, HeaderLang
│   │            /@general    #   PublicHeader/Footer
│   │            /admin       #   ResourceTable, ResourceForm
│   ├── config/resources/     #   опис ресурсів (config-driven CRUD)
│   ├── layouts/              #   default (public), admin, auth
│   ├── stores/               #   Pinia (useAppStore: тема/розмір/…)
│   └── assets/scss/          #   дизайн-система (vars/mixins/main), BEM, теми
├── server/
│   ├── api/                  #   Nitro: auth, admin CRUD, public content
│   └── utils/                #   prisma, crud-движок, реєстри ресурсів
├── prisma/                   #   schema + migrations + seed
└── i18n/
    ├── i18n.config.ts        #   messages бандляться синхронно (не lazy) — SSR не блимає fallback-локаллю
    └── locales/              #   uk.json, en.json
```

> **i18n SSR-нюанс:** `detectBrowserLanguage` вимкнено — у @nuxtjs/i18n v10 + `no_prefix` + SSR
> воно форсить `en` попри cookie. Локаль-persist зроблено вручну в `app/plugins/i18n-locale.ts`
> (читає/пише cookie `i18n_redirected`, ставить `<html lang>`). У **dev** холодний SSR може
> блимнути `en` (Vite module-order артефакт) — у **prod-білді** все коректно (uk за замовчуванням,
> cookie-перемикання, `<html lang>`), перевірено на cold-запитах.

### Generic CRUD-движок (серце адмінки)
Додати новий ресурс = **3 кроки, ~хвилини**:
1. Модель у `prisma/schema.prisma` + міграція.
2. Конфіг у `app/config/resources/<name>.ts` (поля/колонки) + рядок у реєстрі.
3. Запис у `server/utils/resources.ts` (`crudRegistry`) + `publicResources.ts`.

Нових роутів/сторінок писати **не треба** — catch-all `[resource]` роути й динамічні сторінки все підхоплюють. Сайдбар оновлюється сам.

---

## 📊 Модель даних (ресурси)

| Ресурс | Призначення | Ключові поля |
|--------|-------------|--------------|
| **Project** | портфоліо/кейси | title, slug, client, type, year, description, content, image |
| **Service** | послуги | title, description, content, icon |
| **TeamMember** | команда | name, role, bio, photo |
| **Blog** | статті/журнал | title, slug, shortDescription, content, tags, image |
| **Faq** | питання | question, answer, position |
| **StaticPage** | About/Privacy/… | title, slug, content (HTML) |
| **User** | адміни | email, passwordHash, role |

Публічний сайт читає лише `isPublished = true` через `/api/content/[resource]`.

---

## ✅ Що вже зроблено

- **Фундамент:** дизайн-система (SCSS BEM, світла/темна теми з persist), i18n uk/en, утиліти (storage/sanitize/formatters).
- **Адмінка** у стилі Complat: сайдбар (263px, центрований 1200px shell), топбар (мова + тема + аватар + logout), generic CRUD (таблиця з пагінацією/сортом/пошуком/inline-toggle + форма на AppField-кіт).
- **Публічний сайт** (агенційна структура як overchenko): багатосекційна головна (hero → філософія → послуги → роботи → FAQ → блог → CTA), `/projects` + кейс, `/services`, `/team`, `/blog` + стаття, `/contacts`, `/about`, `/page/[slug]`, auth-сторінки (UI-стаби), кастомна 404/500.
- **UX:** повний адаптив (мобільний drawer + burger-меню), BEM по всьому проекту, HeaderLang з прапорцями, форм-кіт AppField (FloatLabel + кастомний switch + Message-помилки).
- **Бекенд:** auth (login/logout/guard), generic admin CRUD, публічний content API, Prisma + Postgres, seed.

**Логін:** креденшли адміна беруться з `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) — не зберігаються в коді.

---

## 🗺️ Roadmap до «готового рішення»

### 🔴 Must-have (без цього не продукт)
- [x] **Feedback на дії** — Toast (стиль Complat) + ConfirmDialog замість нативного `confirm()`. ✓
- [x] **Серверні помилки у формі** — ловимо (duplicate slug → 422) і показуємо. ✓
- [ ] **Завантаження зображень** — upload + storage (замість URL-поля). Найважливіша фіча для контенту.
- [x] **Дашборд** — KPI-лічильники по ресурсах (chart.js у проєкті, графіки — за потреби). ✓

### 🟡 Should-have (робить продукт «дорослим»)
- [ ] **Rich-text редактор** для HTML-контенту (blog/project/page).
- [ ] **Полірування таблиці** — бейджі статусу, кращі порожні стани (колонка дати вже є).
- [x] **Валідація за правилами** — yup-схеми (email/required), реактивно, як Complat. ✓
- [ ] **🔍 SEO** — див. окремий блок нижче (критично важливе).

### 📝 Кожен блок → в адмінку (систематичний прохід — НАСТУПНА ВЕЛИКА ФАЗА)
Пройти **блок за блоком по кожній сторінці** й зробити кожен керованим через адмінку (щоб клієнт міняв усе сам, без розробника). Кандидати із зараз захардкодженого:
- **Hero** головної (заголовок / підзаголовок / текст CTA)
- **Філософія** — 4 принципи → ресурс `principles`
- **CTA-секція** «Готові почати?»
- **Контактні дані** (адреса / телефон / email)
- **SEO-мета** сторінок (metaTitle / metaDescription)

Дрібні тексти (hero / CTA / контакти) → узагальнений **key-value ресурс `settings`/`variables`**, щоб не плодити окремі моделі під кожен рядок.

### 🟢 Later
- [ ] **💳 Оплата** (Stripe) — продаж послуг онлайн.
- [ ] Bulk-дії (масове видалення/публікація).
- [ ] Управління юзерами + ролі/права (RBAC).
- [ ] Профіль/налаштування.
- [ ] Оновлення дизайну.

---

## 🔍 SEO (окремий важливий блок)

Публічна частина вже **SSR** — це база для SEO. Далі треба:

- [ ] **Per-page meta** через `useSeoMeta` (title/description на кожен роут + динамічні для проектів/статей).
- [ ] **Open Graph + Twitter cards** (превʼю в соцмережах).
- [ ] **sitemap.xml** (динамічний, з усіх опублікованих сторінок/проектів/статей) — модуль `@nuxtjs/sitemap`.
- [ ] **robots.txt** — модуль `@nuxtjs/robots`.
- [ ] **Canonical URL** + **hreflang** (uk/en) для мультимовності.
- [ ] **Structured data (JSON-LD)** — Organization, Article, BreadcrumbList.
- [ ] **Продуктивність** (Core Web Vitals) — lazy-load зображень, оптимізація.
- [ ] **SEO-поля в адмінці** — metaTitle/metaDescription на ресурсах (щоб клієнт керував SEO сам).

---

## 🚀 Запуск

```bash
# Postgres (Homebrew)
brew services start postgresql@16

# залежності
npm install

# БД
npm run db:migrate      # prisma migrate dev
npm run db:seed         # адмін + демо-контент

# dev
npm run dev             # → http://localhost:3000
```

- Публічний сайт: `http://localhost:3000/`
- Адмінка: `http://localhost:3000/admin` (логін з `.env`: `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- `.env`: `DATABASE_URL`, `NUXT_SESSION_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (див. `.env.example`)

---

*Живий документ — оновлюємо по ходу роботи.*
