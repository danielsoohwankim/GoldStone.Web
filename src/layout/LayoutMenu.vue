<template>
  <div>
    <md-toolbar class="md-transparent" md-elevation="0">
      <span :style="layoutStyle" class="title">GoldStone</span>
      <div class="md-toolbar-section-end">
        <md-button 
          class="md-icon-button md-dense" 
          @click.prevent="store.toggleMenu(!store.showMenu)"
        >
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-list>
      <LayoutMenuItem 
        :menu="Menus.Dashboard"
      />
      <LayoutMenuItem 
        :menu="Menus.Assets"
      />
      <LayoutMenuItem 
        :menu="Menus.Accountant"
      />
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Menus, Theme } from './_data';
import { ILayoutStore } from './_interfaces';
import store from './_store';
import LayoutMenuItem from './LayoutMenuItem.vue';

@Component({
  components: {
    LayoutMenuItem,
  },
})
export default class LayoutMenu extends Vue {
  @Prop(Object) public readonly layoutStyle!: object;
  // data
  public Menus = Menus;
  public store: ILayoutStore = store;
  // styles

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
}
</style>