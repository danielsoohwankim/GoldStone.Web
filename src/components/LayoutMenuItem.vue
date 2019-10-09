<template>
  <div>
    <router-link :to="menu.route">
      <md-list-item @click="onClick">
        <md-icon 
          :style="menuItemStyle(menu)"
        >{{menu.icon}}
        </md-icon>
        <span 
          :style="menuItemStyle(menu)"
          class="md-list-item-text" 
        >{{menu.title}}
        </span>
      </md-list-item>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Theme } from '@/models/common.ts';
import { IMenu } from '@/models/menu.ts';
import palette from '@/models/palette.ts';
import layout from '@/store/layout.ts';

@Component
export default class LayoutMenu extends Vue {
  @Prop() public readonly menu!: IMenu;
  // data
  // styles

  // computed
  public menuItemStyle(menu: IMenu): object {
    const isCurrentPage: boolean = (menu === layout.menu);

    return (isCurrentPage === true) ? {
        color: palette.default.accent.hex(layout.theme),
        fontWeight: `bold`,
      } : {
        color: palette.default.font.hex(layout.theme),
      };
  }

  // methods
  public onClick(): void {
    layout.setMenu(this.menu);
  }
}
</script>

<style lang="scss" scoped>
</style>