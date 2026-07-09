// Server endpoints return a stable i18n code as statusMessage (e.g. "server.invalidCredentials").
// This resolves it in the current locale; non-code messages pass through, else a fallback key.
export function serverErrorMessage(
  e: any,
  t: (key: string) => string,
  fallbackKey = 'toast.error',
): string {
  const code = e?.data?.statusMessage || e?.statusMessage
  if (typeof code === 'string' && code.startsWith('server.')) return t(code)
  return code || t(fallbackKey)
}
