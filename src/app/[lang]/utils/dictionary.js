import 'server-only'

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ne: () => import('../dictionaries/ne.json').then((module) => module.default),
}

export const getDictionary = async (locale) => {
  try {
    return await dictionaries[locale]()
  } catch (error) {
    throw new Error(`Dictionary not found for locale: ${locale}`)
  }
}