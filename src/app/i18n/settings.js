export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ne'],
}

export const getLocale = (lang) => {
  // Map old locale codes to new ones
  const localeMap = {
    'en': 'en',
    'nep': 'ne'
  }
  return localeMap[lang] || lang
}