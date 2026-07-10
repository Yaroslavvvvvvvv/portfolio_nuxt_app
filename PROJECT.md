# Obsigma — Studio Site + Admin

Сайт веб-студії з власною адмін-панеллю. Референс вигляду й структури — **[overchenko.studio](https://overchenko.studio/)**.

Назва: **Obsigma** — обсидіан (вулканічне скло, з якого робили найгостріші леза) + **Σ** (сума частин; в теорії формальних мов — алфавіт, з якого будується все інше). Знак — `Σ`, вирізана в огранованому камені.

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
│   ├── components/@core      #   AppField-кіт (input/textarea/select/switch/image/editor), theme toggle, HeaderLang
│   │            /@general    #   PublicHeader/Footer
│   │            /admin       #   ResourceTable, ResourceForm
│   ├── composables/          #   useResource (CRUD-клієнт), useSeo (usePageSeo / useJsonLd)
│   ├── config/resources/     #   опис ресурсів (config-driven CRUD) + seo.ts (спільні SEO-поля)
│   ├── layouts/              #   default (public, тримає .app-container), admin, auth
│   ├── stores/               #   Pinia (useAppStore: тема/розмір/лоадер/скрол-лок)
│   ├── utils/                #   sanitize (ізоморфний DOMPurify), validation, serverError, …
│   └── assets/scss/          #   дизайн-система (tokens/vars/mixins/main), BEM, теми
├── server/
│   ├── api/                  #   Nitro: auth, admin CRUD, upload, public content, __sitemap__/urls
│   ├── routes/uploads/       #   віддача файлів локального драйвера сховища
│   └── utils/                #   prisma, crud-движок, реєстри ресурсів, storage, rateLimit
├── shared/utils/             # код, автоімпортований і в app, і в server (Nuxt 4)
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
- **Медіа:** upload зображень (`POST /api/admin/upload`), драйвери `local` / `s3` (R2/B2 через `aws4fetch`), тип файлу визначається за магічними байтами; SVG заборонено.
- **Контент:** rich-text редактор (PrimeVue Editor / Quill) з завантаженням картинок замість base64; ізоморфна санітизація — тіло статей є в SSR-HTML.
- **SEO:** `usePageSeo` / `useJsonLd` на всіх публічних роутах, sitemap + robots (модулі), canonical, JSON-LD, SEO-поля в адмінці.
- **Безпека:** rate-limit на логіні й контактній формі, whitelist `sortField`, `pick(fillable)` проти mass-assignment, yup-валідація на сервері.
- **Бренд:** назва **Obsigma** (обсидіан + Σ), фавікон-пакет (`.ico` / 96px / apple-touch / PWA 192+512), `site.webmanifest`, `theme-color`, дефолтний `og:image`.

**Логін:** креденшли адміна беруться з `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) — не зберігаються в коді.

---

## 🗺️ Roadmap до «готового рішення»

### 🔴 Must-have (без цього не продукт)
- [x] **Feedback на дії** — Toast (стиль Complat) + ConfirmDialog замість нативного `confirm()`. ✓
- [x] **Серверні помилки у формі** — ловимо (duplicate slug → 422) і показуємо. ✓
- [x] **Завантаження зображень** — `AppFieldImage` + `POST /api/admin/upload`; драйвери `local` / `s3` (`server/utils/storage.ts`). Поле лишається текстовим, тож старі зовнішні URL працюють. ✓
- [x] **Дашборд** — KPI-лічильники по ресурсах (chart.js у проєкті, графіки — за потреби). ✓

### 🟡 Should-have (робить продукт «дорослим»)
- [x] **Rich-text редактор** — PrimeVue Editor (Quill) у `AppFieldEditor`; картинки з тулбару та з буфера завантажуються в сховище, а не вшиваються як base64. Allowlist санітайзера розширено (img/blockquote/pre/code/заголовки); `iframe` заборонено свідомо. ✓
- [ ] **Полірування таблиці** — бейджі статусу, кращі порожні стани (колонка дати вже є).
- [x] **Валідація за правилами** — yup-схеми (email/required), реактивно, як Complat. ✓
- [x] **🔍 SEO** — фундамент закрито; лишились продуктивність і BreadcrumbList (див. блок нижче). ✓

### 📝 Прохід по блоках: стилі + функціонал + адмінка (ПОТОЧНА ФАЗА)

Ідемо **сторінка за сторінкою, блок за блоком**. Для кожного блоку три питання:
1. **Стилі** — чи відповідає дизайну, чи адаптивний, чи є в обох темах.
2. **Функціонал** — чи працює те, що має (стани: порожньо / завантаження / помилка).
3. **Адмінка** — чи може клієнт змінити це сам, без розробника.

#### Інвентар захардкодженого (звірено з кодом)

| Де | Що | Куди винести |
|---|---|---|
| `pages/index.vue` | hero (заголовок/текст), заголовки секцій, CTA-секція | `settings` |
| `pages/index.vue` | 4 принципи «філософії» (`home.principles.*`) | ресурс `principles` |
| `pages/contacts.vue:64-68` | `Kyiv, Ukraine`, `+380 00 000 0000`, `hello@example.com` | `settings` |
| `PublicHeader.vue:38`, `PublicFooter.vue:12`, `layouts/admin.vue:26`, `layouts/auth.vue:13` | бренд `Obsigma` — у чотирьох місцях + `site.name` у `nuxt.config` | `settings` |

Дрібні тексти (hero / CTA / контакти / бренд) → узагальнений **key-value ресурс `settings`**,
щоб не плодити окрему модель під кожен рядок. Мультимовність: або колонка на локаль
(`valueUk` / `valueEn`), або `key + locale` як складений унікальний ключ — вирішити на старті,
бо переїжджати потім дорого.

#### Полірування адмінки (паралельно)
- [ ] Бейджі статусу в таблиці замість голого switch.
- [ ] Кращі порожні стани (зараз просто «Немає записів»).
- [ ] Bulk-дії (масове видалення / публікація).
- [ ] Видалення файлу зі сховища, коли поле картинки очищають (зараз лишається сирота).

#### ✓ Уже зняте з цього списку
- ~~**SEO-мета** сторінок (metaTitle / metaDescription)~~ — поля в адмінці для blog / projects / pages.
- ~~**Зображення**~~ — upload замість URL-поля.
- ~~**Контент**~~ — rich-text редактор замість `<textarea>` з HTML.
- ~~**Рік у підвалі**~~ — був літералом `{{ 2026 }}`, тепер обчислюваний.

### 🟢 Later
- [ ] **💳 Оплата** (Stripe) — продаж послуг онлайн.
- [ ] Bulk-дії (масове видалення/публікація).
- [ ] Управління юзерами + ролі/права (RBAC).
- [ ] Профіль/налаштування.
- [ ] Оновлення дизайну.

---

## 🔍 SEO (окремий важливий блок)

Публічна частина вже **SSR** — це база для SEO.

- [x] **Тіло статей у SSR-HTML** — санітизація ізоморфна (`isomorphic-dompurify`), контент рендериться на сервері. ✓
- [x] **Per-page meta** — композабл `usePageSeo` (`app/composables/useSeo.ts`) на всіх публічних роутах. ✓
- [x] **Open Graph + Twitter cards** — там же; `og:image` абсолютизується. Дефолт `/og-default.png` (1200×630), тож сторінка без власної картинки все одно дає `summary_large_image`. Пріоритет: `ogImage` запису → `imagePath` → дефолт. ✓
- [x] **sitemap.xml** — `@nuxtjs/sitemap` + динамічне джерело `server/api/__sitemap__/urls.ts` (лише `isPublished`). ✓
- [x] **robots.txt** — `@nuxtjs/robots` (`/admin`, `/api/` закриті; auth-заглушки `noindex`). ✓
- [x] **Canonical URL** — на кожній сторінці; `/page/about-page` каноніклиться на `/about`. ✓
- [x] **Structured data (JSON-LD)** — Organization (головна), Article (стаття), CreativeWork (кейс). ✓
- [x] **SEO-поля в адмінці** — `metaTitle` / `metaDescription` / `ogImage` на blog, projects, pages. ✓
- [ ] **hreflang** — ЗАБЛОКОВАНО: при `strategy: 'no_prefix'` обидві локалі живуть на одній URL, альтернативи нема на що вказати. Потрібен перехід на `prefix_except_default`.
- [ ] **BreadcrumbList** (JSON-LD) — не зроблено.
- [ ] **Продуктивність** (Core Web Vitals) — lazy-load зображень, оптимізація.

**Змінна оточення:** `NUXT_PUBLIC_SITE_URL` — реальний домен у проді (без слеша в кінці). Без неї canonical/og/sitemap вкажуть на `http://localhost:3000`.

---

## ⚠️ Інваріанти (легко зламати, правлячи стилі)

Кожен пункт — про реальний баг, який уже ловили. Порушиш — воно не впаде, просто зіпсується.

**Ширина сторінки.** `.app-container` живе **тільки** в `layouts/default.vue`. У сторінках його не дублювати.
Вузькі шели (`.pub-article`, `.pub-faq`) вкладаються всередину і **не мають горизонтального padding** —
його дає контейнер. Full-bleed секція (тло на всю ширину вікна) тепер вимагає свідомого виходу з контейнера,
напр. `margin-inline: calc(50% - 50vw)`.

**Темна тема.** `--color-surface-base` **дорівнює** `--color-bg` в обох темах. Це не випадковість:
адмін-шел обмежений 1200px, і сайдбар/топбар іншого відтінку малюють видимий шов по краю шела.
Для піднятих поверхонь (поповери, дропдауни, картки) — `--color-surface`.

**Адаптив адмінки.** `padding-right: 0` у `.admin__content` працює лише поки відцентрований 1200px-шел
лишає зовнішній зазор. Тому: `<1264px` → `padding-right: 32px`, `<1024px` (сайдбар стає драйвером) → `16px`.
Міняючи `max-width` шела — перерахувати поріг `1264 = 1200 + 2×32`.

**Скрол-лок.** Повноекранні оверлеї блокують скрол через `app.SET_FIXED_STATUS(true)` → клас `html.app-fix`
(CSS у `_base.scss`). Не робити `overflow: hidden` руками.

**Мобільне меню.** Показ/приховування — `opacity` + `pointer-events` + `visibility`, ніколи `display`
(не анімується, а без `visibility` посилання лишаються в tab-порядку). Висота — `100dvh`, не `100vh`.

**Санітайзер вирішує, що доживе до сторінки.** `ALLOWED_TAGS` в `app/utils/sanitize.ts` — це контракт
із rich-text редактором. Додав кнопку в редактор (таблиця, відео) — **спочатку** додай тег в allowlist,
інакше редактор пише, а сайт мовчки вирізає. `iframe` заборонено свідомо.

**Завантаження файлів.** Тип визначається за магічними байтами, а не за `Content-Type` від браузера.
Ліміт 5 МБ. SVG заборонено (може нести `<script>`, а віддаємо ми з власного origin).

**Адмінка — SPA** (`routeRules: '/admin/**': { ssr: false }`). `useSeoMeta` там не потрібен.

**`og:image` абсолютний і будується від `site.url`.** Без `NUXT_PUBLIC_SITE_URL` у проді кожна сторінка
віддасть соцмережам посилання на `http://localhost:3000` — картка буде порожня. Раніше це били лише сторінки
з власною картинкою, тепер — усі, бо є дефолт.

**i18n.** `detectBrowserLanguage` вимкнено навмисно (див. нюанс вище). `hreflang` неможливий при
`strategy: 'no_prefix'` — обидві локалі на одній URL.

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
