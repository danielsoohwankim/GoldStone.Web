<template>
  <div id="app">
    <div v-if="layoutStore.page === Page.Default">
      <Layout />
    </div>
    <div v-else-if="layoutStore.page === Page.Home">
      <Home />
    </div>
    <div v-else>
      <NotFound />
    </div>
    <Loader />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import NotFound from '@/404/NotFound.vue';
import { Menus, Page, Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import Layout from '@/layout/Layout.vue';
import Loader from '@/layout/Loader.vue';
import Home from '@/home/Home.vue';
import { storageTools } from '@/shared/_tools';
import tenantStore from '@/tenant/_store';

@Component({
  components: {
    Layout,
    Loader,
    NotFound,
    Home,
  },
})
export default class App extends Vue {
  // data
  public layoutStore = layoutStore;
  public Page = Page;
  public tenantStore = tenantStore;

  // lifecycle
  /**
   * Mounted on App.vue is always called ONCE on initial page load.
   * For known paths, $route.path is always '/'.
   * When you access the page with route path (e.g. /assets),
   * the site will initially enter mounted with '/', and
   * vue router will then change it to '/assets'.
   */
  public async mounted(): Promise<void> {
    console.log('mounted', this.$route.path);
    let path: string = this.$route.path;
    if (storageTools.hasPath() === true) {
      path = storageTools.getPath();
      this.$router.push(path);
    }
    console.log('mounted path: ', storageTools.hasPath(), path);
    if (Menus.IsValidPath(path) === false) {
      layoutStore.setPage(Page.NotFound);
      return;
    } else if (storageTools.hasToken() === true) {
      await tenantStore.signIn(storageTools.getToken());
    } else {
      await tenantStore.signIn();
    }
  }

  // computed
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("light", (
  primary: md-get-palette-color(gray, 500),
  accent: md-get-palette-color(red, A200),
));

@include md-register-theme("dark", (
  primary: md-get-palette-color(gray, 400),
  accent: red,
  theme: dark,
));

@import "~vue-material/dist/theme/all"; // Apply the theme
// @import "~vue-material/dist/components/MdToolbar/theme";
// @import "~vue-material/dist/components/MdDrawer/theme";
</style>
