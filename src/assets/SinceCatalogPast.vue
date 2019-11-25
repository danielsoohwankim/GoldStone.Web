<template>
  <div
    class="asset-catalog past"
    :class="[
      layoutStore.theme, 
      (hover === true) ? `hover-${layoutStore.Theme}` : ''
    ]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <md-list class="asset-catalog-user">
      <md-list-item>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-symbol">
      <md-list-item>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-name">
      <md-list-item>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-since">
      <md-list-item>
        <span class="asset-catalog-past">
          {{ this.Sinces.toString(this.catalog.since) }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-date">
      <md-list-item>
        <span class="asset-catalog-past">
          {{ this.catalog.date }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-balance">
      <md-list-item>
        <span class="asset-catalog-past">
          {{ balance }}
        </span>
      </md-list-item>
    </md-list>
    
    <md-list class="asset-catalog-change">
      <md-list-item>
        <span class="asset-catalog-past">
          <SinceCatalogChange
            :bold="false"
            :catalog="this.catalog"
          />
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-edit">
      <md-list-item>
        <span class="asset-catalog-past">
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Sinces } from './_data';
import { ISinceCatalog, IAssetTools } from './_interfaces';
import tools from './_tools';
import SinceCatalogChange from './SinceCatalogChange.vue';
import { Theme } from '@/layout/_data';
import { ILayoutStore } from '@/layout/_interfaces';
import layoutStore from '@/layout/_store';

@Component({
  components: {
    SinceCatalogChange,
  },
})
export default class SinceCatalogPast extends Vue {
  @Prop() public readonly catalog!: ISinceCatalog;
  // data
  public hover: boolean = false;
  public readonly layoutStore: ILayoutStore = layoutStore;
  public readonly Sinces: Sinces = Sinces;

  // styles

  // computed
  get balance(): string {
    return `$${tools.toCurrencyString(this.catalog.balance)}`;
  }

  // methods
}
</script>

<style lang="scss" scoped>
.asset-catalog-past {
  margin-top: -15px;
}

.asset-catalog .past > .md-list {
  height: 50px;
  display: inline-block;
}
</style>
