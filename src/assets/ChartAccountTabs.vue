<template>
  <div class="layout">
    <div class="left">
      <md-tabs 
        class="md-transparent"
        :md-active-tab="selectedChartAccountId"
      >
        <template slot="md-tab" slot-scope="{ tab }">
          <ChartAccountTab
            :assetView="assetView"
            :tab="tab" 
          />
        </template>
        <md-tab
          :id="totalAccount.id"
          :md-label="totalAccount.symbol"
          @click.prevent="onClick(totalAccount.id)"
        ></md-tab>
        <md-tab
          v-for="account in assetAccounts"
          @click.prevent="onClick(account.id)"
          :id="account.id"
          :key="account.id"
          :md-label="account.symbol"
        >
        </md-tab>
      </md-tabs>
    </div>
    <md-content
      @click.prevent="toggleExpandChart()"
      class="right"
    >
    </md-content>
    <br class="clear" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsConstants } from './_data';
import { IAccount, IAsset, IAssetTools, IAssetView } from './_interfaces';
import store from './_store';
import tools from './_tools';
import ChartAccountTab from './ChartAccountTab.vue';
import { ILayoutStore } from '@/layout/_interfaces';
import layoutStore from '@/layout/_store';

@Component({
  components: {
    ChartAccountTab,
  },
})
export default class ChartAccountTabs extends Vue {
  @Prop() public readonly asset!: IAsset;
  @Prop() public readonly assetView!: IAssetView;
  // data
  public readonly layoutStore: ILayoutStore = layoutStore;

  // styles

  // computed
  get assetAccounts(): IAccount[] {
    const asset: IAsset = store.assetMap[this.asset.id];
    const accounts: IAccount[] =
      Object
        .values(asset.accountMap)
        .filter((account: IAccount) => account.id !== assetsConstants.totalId);

    return accounts;
  }

  get selectedChartAccountId(): string {
    return store.assetMap[this.asset.id].selectedChartAccountId!;
  }

  get totalAccount(): IAccount {
    return store.assetMap[this.asset.id].accountMap[assetsConstants.totalId];
  }

  // methods
  public onClick(accountId: string): void {
    if (this.asset.selectedChartAccountId === accountId) {
      return;
    }

    store.selectChartAccount({
      assetId: this.asset.id,
      accountId,
    });
  }

  public toggleExpandChart(): void {
    store.toggleExpandChart({
      assetId: this.asset.id,
      expand: !this.asset.expandChart,
    });
  }
}
</script>

<style lang="scss" scoped>
.clear {
  clear: left;
}

.layout {
  height: 55px;
}

.left {
  float: left;
}

.right {
  overflow: hidden;
  width: auto;
  height: 48px;
}
</style>
