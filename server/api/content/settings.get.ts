// Public, read-only view of the site settings — consumed by the SSR home page.
// Only whitelisted keys ever leave the database (see server/utils/settings.ts).
export default defineEventHandler(async () => readSettings())
