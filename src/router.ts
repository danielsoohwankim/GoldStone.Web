import Vue from 'vue';
import Router from 'vue-router';
import { menus } from '@/layout/_data';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      alias: `/${menus.dashboard.name}`,
      name: menus.dashboard.name,
      component: () => import(/* webpackChunkName: "dashboard" */ `@/dashboard/Dashboard.vue`),
    },
    {
      path: `/${menus.assets.name}`,
      name: menus.assets.name,
      component: () => import(/* webpackChunkName: "assets" */ `@/assets/Assets.vue`),
    },
    {
      path: `/${menus.accountant.name}`,
      name: menus.accountant.name,
      component: () => import(/* webpackChunkName: "accountant" */ `@/accountant/Accountant.vue`),
    },
  ],
});
