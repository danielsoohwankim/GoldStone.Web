import Vue from 'vue';
import Router from 'vue-router';
import { Menu } from '@/models/menu.ts';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      alias: `/${Menu.dashboard.name}`,
      name: Menu.dashboard.name,
      component: () => import(/* webpackChunkName: "dashboard" */ `@/views/Dashboard.vue`),
    },
    {
      path: `/${Menu.assets.name}`,
      name: Menu.assets.name,
      component: () => import(/* webpackChunkName: "assets" */ `@/views/Assets.vue`),
    },
    {
      path: `/${Menu.accountant.name}`,
      name: Menu.accountant.name,
      component: () => import(/* webpackChunkName: "accountant" */ `@/views/Accountant.vue`),
    },
  ],
});
