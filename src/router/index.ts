/// Router module
import { Router, createRouter, createWebHashHistory } from 'vue-router';

// Views
import Index from '@/views/Index.vue';
import Settings from '@/views/Settings.vue';
import Subscriptions from '@/views/Subscriptions.vue';

// Export router
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/subscriptions',
      component: Subscriptions
    },
    {
      path: '/settings',
      component: Settings
    }
  ]
});
