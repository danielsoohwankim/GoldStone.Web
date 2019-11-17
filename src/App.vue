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
import userStore from '@/user/_store';

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
  public userStore = userStore;

  // lifecycle
  public async mounted(): Promise<void> {
    if (Menus.IsValidPath(this.$route.path) === true) {
      if (this.$route.path === '/') {
        layoutStore.toggleSignInButton(true);
      }

      return;
    }
    // in the wrong page
    layoutStore.setPage(Page.NotFound);
  }

  // computed
  get routePath(): string | undefined {
    return this.$route.path;
  }

  @Watch('routePath')
  public async onRouteNameChange(newPath, oldPath) {
    // tslint:disable-next-line
    console.log('route changed from ' + oldPath + ' to ' + newPath);
    if (Menus.IsValidPath(newPath) === false) {
      layoutStore.setPage(Page.NotFound);
      return;
    }

    await userStore.signIn();
  }
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
