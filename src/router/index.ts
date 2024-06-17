/// Router module
import { Router, createRouter, createWebHashHistory } from 'vue-router';

// Views
import Index from '@/views/Index.vue';

// Export router
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Index
    }
  ]
});
