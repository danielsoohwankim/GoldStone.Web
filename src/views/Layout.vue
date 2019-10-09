<template>
  <div 
    class="page-container"
    @click="onClick($event)"
  >
    <md-app :md-theme="toolbarTheme">
      <md-app-toolbar class="md-primary" md-elevation="0">
        <md-button 
          class="md-icon-button" 
          @click="toggleMenu" 
          v-if="!showMenu"
        >
          <md-icon :style="toolbarStyle">menu</md-icon>
        </md-button>
        <span 
          :style="toolbarStyle"
          class="md-title"
        >
         {{menu.title}} 
        </span>
        
        <div class="md-toolbar-section-end">
          <LayoutSetting :settingStyle="toolbarStyle" />
        </div>
      </md-app-toolbar>

      <md-app-drawer 
        :md-theme="toolbarTheme"
        :md-active.sync="showMenu" 
        md-persistent="mini"
      >
        <LayoutMenu 
          :layoutStyle="toolbarStyle"
        />
      </md-app-drawer>

      <md-app-content 
        :style="contentStyle"
        :md-theme="contentTheme"
      >
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import LayoutMenu from '@/components/LayoutMenu.vue';
import LayoutSetting from '@/components/LayoutSetting.vue';
import { Theme } from '@/models/common.ts';
import { IMenu, Menu } from '@/models/menu.ts';
import palette from '@/models/palette.ts';
import layout from '@/store/layout.ts';

@Component({
  components: {
    LayoutMenu,
    LayoutSetting,
  },
})
export default class Layout extends Vue {
  // properties
  // data
  // styles

  // lifecycle
  public created() {
    // set current menu
    const unwatch = this.$watch(
      () => this.$route,
      (route, prevRoute) => {
        const menuName: string = this.$route.name!;
        const menu: IMenu = Menu.getMenu(menuName);

        layout.setMenu(menu);

        unwatch();
      });
  }

  // computed
  get menu(): IMenu {
    return layout.menu;
  }

  get showMenu(): boolean {
    return layout.showMenu;
  }

  // needs to be computed to dynamically change based on theme
  get toolbarStyle(): object {
    return {
      color: palette.nav.accent.hex(layout.theme),
      fontWeight: 'bold',
    };
  }

  get contentStyle(): object {
    return {
      backgroundColor: (layout.theme === Theme.Light)
        ? '#fafafa' : '#2a2a2a',
    };
  }

  get toolbarTheme(): string {
    return (layout.theme === Theme.Light) ? 'nav-default' : 'nav-default-dark';
  }

  get contentTheme(): string {
    return (layout.theme === Theme.Light) ? 'default' : 'default-dark';
  }

  // methods
  public toggleMenu(): void {
    layout.toggleMenu(!layout.showMenu);
  }

  public onClick($event): void {
    const clickedSettingButton: boolean =
      document.getElementById('setting-button')!.contains($event.target) === true;
    const clickedSettingPanel: boolean =
      document.getElementById('setting-panel')!.contains($event.target) === true;

    if (layout.showSetting === true &&
        clickedSettingButton === false &&
        clickedSettingPanel === false) {
      layout.toggleSetting(false);
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