import { LanguageService } from "@/services/storageService"
// import { createI18n } from "vue-i18n"
// import en from "./t/en.js"
// import tig from "./t/tig.js"
import { setupI18n } from "./localization.js"
// import apiRequest from '../services/apiRequest.js';

let currentLanguage = LanguageService.getCurrentLanguage()
if (!currentLanguage) {
  currentLanguage = "en"
  LanguageService.setCurrentLanguage(currentLanguage)
}
// const i18n = createI18n({
//   locale: currentLanguage,
//   fallbackLocale: "en",
//   sync: true,
//   silentTranslationWarn: false,
//   missingWarn: true,
//   messages: {
//     en,
//     tig,
//   },
// })

export default async () => await setupI18n(currentLanguage)
/**
 * FYI: if you want to change a language use the ff code in a view or component method
 *
 * LanguageService.setCurrentLanguage('tig');
 * this.$i18n.locale = 'tig';
 */
