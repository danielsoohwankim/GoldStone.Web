<template>
  <div 
    class="asset-catalog"
    @click.prevent="toggleExpandChart()"
  >
    <md-list class="asset-catalog-symbol" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layoutStore.theme"
        >Symbol
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-name" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layoutStore.theme"
        >Name
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-since" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layoutStore.theme"
        >Since
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-date" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layoutStore.theme"
        >Date
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-balance" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layoutStore.theme"
        >Balance
        </span>
      </md-list-item>
    </md-list>
    
    <md-list class="asset-catalog-change" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layoutStore.theme"
        >Change
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsView } from './_data';
import { IAsset, IAssetTools } from './_interfaces';
import store from './_store';
import tools from './_tools';
import { Theme } from '@/layout/_data';
import { ILayoutStore } from '@/layout/_interfaces';
import layoutStore from '@/layout/_store';

@Component
export default class SinceCatalogHeader extends Vue {
  @Prop() public readonly asset!: IAsset;
  // data
  public readonly layoutStore: ILayoutStore = layoutStore;

  // styles
  get headerStyle(): object {
    return {
      backgroundColor: assetsView.layout.color[layoutStore.theme].background,
      borderBottom: `5px solid ${assetsView.layout.color[layoutStore.theme].border}`,
    };
  }

  // computed

  // methods
  public toggleExpandChart(): void {
    store.toggleExpandChart({
      assetName: this.asset.name,
      expandChart: !this.asset.expandChart,
    });
  }
}
</script>

<style lang="scss" scoped>
.asset-catalog {
  margin-top: -3px; margin-bottom: -3px;
}

.title {
  font-size: 16px; 
  font-weight: bold;
  margin-top: -5px;
}

.light {
  color: #757575;
}

.dark {
  color: #bdbdbd;
}

.title span {
  vertical-align: middle;
}
</style>
