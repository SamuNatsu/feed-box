/// Router module
import { Router, createRouter, createWebHashHistory } from 'vue-router';

// Views
import Feeds from '@/views/Feeds.vue';
import Index from '@/views/Index.vue';
import Settings from '@/views/Settings.vue';

// Export router
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/feeds',
      component: Feeds
    },
    {
      path: '/settings',
      component: Settings
    }
  ]
});
