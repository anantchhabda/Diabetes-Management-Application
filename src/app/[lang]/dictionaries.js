import 'server-only'
 
const dictionaries = {
  eng: () => import('./dictionaries/eng.json').then((module) => module.default),
  nep: () => import('./dictionaries/nep.json').then((module) => module.default),
}
 
export const getDictionary = async (locale) => dictionaries[locale]()