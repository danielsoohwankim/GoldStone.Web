<template>
  <div 
    class="page-container"
    @click.prevent="onClick($event)"
  >
    <md-app :md-theme="store.theme">
      <md-app-toolbar 
        class="md-primary" 
        md-elevation="0"
        :style="backgroundStyle" 
      >
        <md-button 
          class="md-icon-button" 
          @click.prevent="store.toggleMenu(!store.showMenu)" 
          v-if="!store.showMenu"
        >
          <md-icon :style="toolbarStyle">menu</md-icon>
        </md-button>
        <span 
          :style="toolbarStyle"
          class="md-title"
        >
         {{store.menu.title}} 
        </span>
        
        <div class="md-toolbar-section-end">
          <LayoutSetting 
            :settingStyle="toolbarStyle" />
        </div>
      </md-app-toolbar>

      <md-app-drawer 
        :md-theme="store.theme"
        :md-active="store.showMenu" 
        md-persistent="mini"
      >
        <LayoutMenu 
          :layoutStyle="toolbarStyle"
        />
      </md-app-drawer>

      <md-app-content 
        :style="contentStyle"
      >
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import colors from 'material-colors';
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Theme } from './_data';
import { ILayoutStore, IMenu } from './_interfaces';
import store from './_store';
import LayoutMenu from './LayoutMenu.vue';
import LayoutSetting from './LayoutSetting.vue';

@Component({
  components: {
    LayoutMenu,
    LayoutSetting,
  },
})
export default class Layout extends Vue {
  // properties
  // data
  public store: ILayoutStore = store;
  // styles

  // lifecycle
  public created() {
    // set current menu
    const unwatch = this.$watch(
      () => this.$route,
      (route, prevRoute) => {
        const menuName: string = this.$route.name!;

        store.setMenu(menuName);

        unwatch();
      });
  }

  // computed
  get backgroundStyle(): object {
    return {
      backgroundColor: (store.theme === Theme.Light)
        ? 'white'
        : colors.grey[900],
    };
  }

  // needs to be computed to dynamically change based on theme
  get toolbarStyle(): object {
    return {
      color: (store.theme === Theme.Light)
        ? '#0078D4' : '#98C6FF',
      fontWeight: 'bold',
    };
  }

  get contentStyle(): object {
    return {
      backgroundColor: (store.theme === Theme.Light)
        ? '#fafafa' : '#2a2a2a',
    };
  }

  // methods
  public onClick($event): void {
    // close setting panel when the user clicks outside its layer
    const clickedSettingButton: boolean =
      document.getElementById('setting-button')!.contains($event.target) === true;
    const clickedSettingPanel: boolean =
      document.getElementById('setting-panel')!.contains($event.target) === true;

    if (store.showSetting === true &&
        clickedSettingButton === false &&
        clickedSettingPanel === false) {
      store.toggleSetting(false);
    }
  }
}
</script>

<style lang="scss" scoped>
.md-app {
  height: 100vh
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>