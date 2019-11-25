<template>
  <div>
    <router-link :to="menu.path">
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
import colors from 'material-colors';
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Menus, Theme } from './_data';
import { IMenu } from './_interfaces';
import store from './_store';
// todo: remove
import tenant from '@/tenant/_store';

@Component
export default class LayoutMenu extends Vue {
  @Prop() public readonly menu!: IMenu;
  // data
  // styles

  // computed
  public menuItemStyle(menu: IMenu): object {
    const isCurrentPage: boolean = (menu === store.menu);

    return (isCurrentPage === true) ? {
        color: colors.red.a200,
        fontWeight: `bold`,
      } : {
        color: (store.theme === Theme.Light)
          ? '#000' : '#fff',
      };
  }

  // methods
  public onClick(): void {
    // todo: remove
    if (this.menu.name === Menus.Accountant.name) {
      window.location.href = `https://goldstone.azurewebsites.net/expenses?${tenant.id}`;
      return;
    }

    if (store.menu.name === this.menu.name) {
      return;
    }

    store.setMenu(this.menu.name);
  }
}
</script>

<style lang="scss" scoped>
</style>