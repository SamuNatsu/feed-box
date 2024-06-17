/// I18n module
import { I18n, createI18n } from 'vue-i18n';

// Locales
import en from '@/i18n/locales/en.json';

// Export i18n
export const i18n: I18n = createI18n({
  fallbackLocale: 'en',
  legacy: false,
  messages: { en }
});
