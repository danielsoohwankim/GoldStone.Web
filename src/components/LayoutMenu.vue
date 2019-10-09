<template>
  <div>
    <md-toolbar class="md-transparent" md-elevation="0">
      <span :style="layoutStyle" style="font-size: 16px;">GoldStone</span>
      <div class="md-toolbar-section-end">
        <md-button 
          class="md-icon-button md-dense" 
          @click="toggleMenu"
        >
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-list>
      <LayoutMenuItem 
        :menu="menu.dashboard"
      />

      <LayoutMenuItem 
        :menu="menu.assets"
      />

      <LayoutMenuItem 
        :menu="menu.accountant"
      />
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import LayoutMenuItem from '@/components/LayoutMenuItem.vue';
import { IMenu, Menu } from '@/models/menu.ts';
import palette from '@/models/palette.ts';
import layout from '@/store/layout.ts';

@Component({
  components: {
    LayoutMenuItem,
  },
})
export default class LayoutMenu extends Vue {
  @Prop(Object) public readonly layoutStyle!: object;
  // data
  public menu: Menu = Menu;
  // styles

  // computed

  // methods
  public toggleMenu(): void {
    layout.toggleMenu(!layout.showMenu);
  }
}
</script>

<style lang="scss" scoped>
</style>