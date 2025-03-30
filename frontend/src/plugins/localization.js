import { nextTick } from "vue"
import { createI18n } from "vue-i18n"
import apiRequest from "../services/apiRequest.js"
import axios from "axios"
import { init } from "./axios.js"
export const SUPPORT_LOCALES = ["en", "tg"]

export async function setupI18n( locale= "en") {
  const i18n = createI18n(
    {
      locale,
      fallbackLocale: "en",
      sync: false,
      silentTranslationWarn: false,
      missingWarn: false,
      // missing: registerKey
    }
)
  await setI18nLanguage(i18n, locale)
  return i18n
}

async function registerKey(locale, key) {
  init(axios)
  await apiRequest.request(axios, {
    url: "config/localization",
    method: "post",
    data: {
      key,
      en: key,
      tg: key
    }
  })
}

export async function setI18nLanguage(i18n, locale) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  // TODO load 
  // await loadLocaleMessages(i18n, locale)
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  // document.querySelector('html').setAttribute('lang', locale)
}

export async function switchLanguage(locale) {
  await setupI18n(locale)
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  init(axios)
  const { items = [] } = await apiRequest.request(axios, {
    url: "config/localization/" + locale,
    method: "get",
  })
  // const messages = await import(
  //   /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  // )

  // set locale and locale message
  // i18n.global.setLocaleMessage(locale, messages.default)
  const messages = items.reduce((acc, item) => {
    acc[item.key] = item[locale]
    return acc
  }, {})
  console.log("messages ", messages)
  i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}

//   // navigation guards
//   router.beforeEach(async (to, from, next) => {
//     const paramsLocale = to.params.locale

//     // use locale if paramsLocale is not in SUPPORT_LOCALES
//     if (!SUPPORT_LOCALES.includes(paramsLocale)) {
//       return next(`/${locale}`)
//     }

//     // load locale messages
//     if (!i18n.global.availableLocales.includes(paramsLocale)) {
//       await loadLocaleMessages(i18n, paramsLocale)
//     }

//     // set i18n language
//     setI18nLanguage(i18n, paramsLocale)

//     return next()
//   })
