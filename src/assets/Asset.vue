<template>
  <div class="asset">
    <div class="list">
      <md-list :style="listStyle">
        <md-list-item 
          md-expand
          :md-expanded="this.expanded"
          :style="listItemStyle"
        >
          <md-icon>
            <span style="color: white;">{{ assetView.icon }}</span>
          </md-icon>
          <span class="md-list-item-text asset-title">
            {{ assetView.title }}
          </span>

          <md-list slot="md-expand">
            <md-list-item style="margin: -12px -16px;">
              <div class="asset-catalog" :style="scrollStyle">
                <ChartLayout
                  v-if="asset.expandChart"
                  :asset="asset"
                  :assetView="assetView"
                />
                <SinceCatalogHeader
                  :asset="asset"
                />
                <div
                  v-for="account in accounts"
                  :key="account.id"
                >
                  <SinceCatalogToday
                    :account="account"
                    :assetView="assetView"
                    :catalog="getTodayCatalog(account)"
                  />
                  <div v-if="account.expand === true">
                    <div
                      v-for="catalog in getPastCatalogs(account)"
                      :key="catalog.date"
                    >
                      <SinceCatalogPast :catalog="catalog" />
                    </div>
                  </div>
                </div>
              </div>
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsConstants, assetsView, Since } from './_data';
import { IAccount, ISinceCatalog, IAsset, IAssetView } from './_interfaces';
import store from './_store';
import SinceCatalogHeader from './SinceCatalogHeader.vue';
import SinceCatalogPast from './SinceCatalogPast.vue';
import SinceCatalogToday from './SinceCatalogToday.vue';
import ChartLayout from './ChartLayout.vue';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import { device } from '@/shared/_tools';

@Component({
  components: {
    ChartLayout,
    SinceCatalogHeader,
    SinceCatalogPast,
    SinceCatalogToday,
  },
})
export default class Asset extends Vue {
  @Prop() public readonly asset!: IAsset;
  @Prop() public readonly assetView!: IAssetView;
  @Prop() public readonly expanded!: boolean;
  // data
  // order for display total asset's accounts
  private totalAssetAccountOrder: IAssetView[] = [
    assetsView.investment,
    assetsView.cash,
    assetsView.liquid,
    assetsView.retirement,
  ];

  // styles
  get listStyle(): object {
    return {
      backgroundColor: (layoutStore.theme === Theme.Light)
        ? '#fff' : '#2a2a2a',
    };
  }

  get listItemStyle(): object {
    return {
      backgroundColor: this.assetView.color[layoutStore.theme].default,
    };
  }

  get scrollStyle(): object {
    return (device.isMobile() === true)
      ? { overflowX: 'scroll' }
      : {};
  }

  // computed
  get accounts(): IAccount[] {
    if (this.asset.name === assetsView.assets.name) {
      // reorder total accounts
      const accounts: IAccount[] = [];
      if (Object.keys(this.asset.accountMap).length <= 0) {
        return accounts;
      }

      this.totalAssetAccountOrder.forEach(
        (a) => accounts.push(this.asset.accountMap[a.name]));
      accounts.push(this.asset.accountMap[assetsConstants.totalAccountId]);

      return accounts;
    }

    return Object.values(this.asset.accountMap);
  }

  // methods
  public getPastCatalogs(account: IAccount): ISinceCatalog[] {
    const pastCatalogs: ISinceCatalog[] = [];

    store.sinces
      .filter((since) => since !== Since[Since.Today])
      .forEach((since) => pastCatalogs.push(account.sinceCatalogMap[since]));

    return pastCatalogs;
  }

  public getTodayCatalog(account: IAccount): ISinceCatalog {
    return account.sinceCatalogMap[Since[Since.Today]];
  }
}
</script>

<style lang="scss">
$content-width: 100%;

.list {
  width: $content-width;
}

.asset {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  z-index: 0;
}

.asset > .md-list {
  width: $content-width;
  max-width: 100%;
  height: 400px;
  display: inline-block;
  overflow: auto;
  border: 1px solid rgba(#000, .12);
  vertical-align: top;
}

.asset-catalog {
  width: 100%;
  max-width: 100%;
  height: 100%;
  vertical-align: top;
}

.asset-catalog > .md-list {
  height: 60px;
  display: inline-block;
}

.asset-catalog .dark > .md-list {
  border-bottom: 1px solid rgba(#fff, .1);
}

.asset-catalog .light > .md-list {
  border-bottom: 1px solid rgba(#000, .1);
}

.asset-title {
  color: white;
  font-weight: 500;
  font-size: 1.25rem;
}

.asset-catalog-symbol {
  width: 10%;
  min-width: 100px;
}

.asset-catalog-name {
  width: 30%;
  min-width: 250px;
}

.asset-catalog-since {
  width: 13%;
  min-width: 100px;
}

.asset-catalog-date {
  width: 17%;
  min-width: 150px;
}

.asset-catalog-change {
  width: 15%;
  min-width: 200px;
}

.asset-catalog-balance {
  width: 15%;
  min-width: 150px;
}

.hover-dark > .md-list {
  background-color: black;
}

.hover-light > .md-list {
  background-color: #ececec;
}

.updated-date {
  font-size: 12px;
  font-style: italic;
}
</style>
