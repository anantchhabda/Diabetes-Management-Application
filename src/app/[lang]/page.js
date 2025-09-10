// src/app/[lang]/page.js
import { getDictionary } from './utils/dictionary'
import { getLocale } from '../i18n/settings'
import HomePage from './components/HomePage'

export default async function Page({ params: { lang } }) {
  try {
    const locale = await Promise.resolve(getLocale(lang))
    const dict = await getDictionary(locale)
    
    return <HomePage dict={dict} locale={locale} />
  } catch (error) {
    console.error('Error loading page:', error)
    return <div>Error loading content</div>
  }
}
