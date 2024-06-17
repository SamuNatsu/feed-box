/// Main entry
import { createApp } from 'vue';

// Global stylesheets
import '@/style.css';

// Root component
import App from '@/App.vue';

// Plugins
import { i18n } from '@/i18n';
import { router } from '@/router';

// Create application
createApp(App).use(i18n).use(router).mount('#app');
