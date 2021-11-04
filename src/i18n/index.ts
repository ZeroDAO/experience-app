/**
 * vue-i18n 使用姿势说明
 * see more : https://pikax.me/vue-composable/composable/i18n/i18n.html#parameters
 */

import { includes } from 'lodash'
import moment from 'moment'
import { findKeyByValue } from '@/utils/common'
import { useI18n } from 'vue-composable'
import zhCN from '@/i18n/messages/zhCN'
import en from '@/i18n/messages/en'
import store from '@/store'
import { setStoreState } from '../store/utils'

const __LOCALE__ = store.state.app.language

if (!__LOCALE__) {
  //__LOCALE__ = window.navigator.language.split('-').join('')
  setStoreState('app', 'language', 'zhCN')
}

export const Locales: any = {}

export const TranslateTable: { [key: string]: string } = {
  en: 'en_US',
  zhCN: 'zh_CN'
}

export const LanguageNameList: { [key: string]: string } = {
  en: 'English',
  zhCN: '简体(中文)'
}

export const i18nInstance = useI18n({
  locale: 'zhCN',
  messages: {
    zhCN,
    en
  }
})

/**
 * @description Automatic loading of language templates required by antd-vue
 */
function loadAtdLocales() {
  const files = require.context('../../node_modules/ant-design-vue/es/locale-provider', true, /\.js$/)
  files.keys().forEach(key => {
    const fileName = key.slice(2, key.lastIndexOf('.'))
    if (includes(TranslateTable, fileName)) {
      const localeKey = findKeyByValue(TranslateTable, fileName)
      if (localeKey) {
        Locales[localeKey] = files(key).default
      }
    }
  })
}

/**
 * @functin setLang - set the app's language
 * @param {string} lang - the language will be setted
 * @return {string} lang - langguage name
 */

function _set(lang: keyof typeof TranslateTable): keyof typeof TranslateTable {
  i18nInstance.locale.value = lang as any
  // Set the time for the current language
  moment.locale(TranslateTable[lang])
  // Axios.defaults.headers.common['Accept-Language'] = lang
  setStoreState('app', 'language', lang)
  return lang
}

/**
 * @functin Asyn loading of custom i18n templates
 * @param {string} lang - Language to be replaced
 * @return {string} lang - Only after returning the language to be changed
 */
export function setLang(lang: string): Promise<keyof typeof TranslateTable | 'same'> {
  if (lang === i18nInstance.locale.value) {
    return Promise.resolve('same')
  }
  return Promise.resolve(_set(lang))
}

loadAtdLocales()
setLang(__LOCALE__)
