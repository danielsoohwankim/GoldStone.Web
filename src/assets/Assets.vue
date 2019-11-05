<template>
  <div>
    <SinceSelect
      :selectedSince="store.maxSince"
    />
    <div v-for="assetView in assetViews" :key="assetView.name">
      <Asset 
        :asset="getAsset(assetView.id)"
        :assetView="assetView"
        :expanded="assetView.expanded"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsConstants, assetsView, Sinces } from './_data';
import { IAsset, IAssetMap, IAssetView, IAssetsStore } from './_interfaces';
import store from './_store';
import tools from './_tools';
import Asset from './Asset.vue';
import SinceSelect from './SinceSelect.vue';
import { Date } from '@/shared/Date';
import { IUser } from '@/user/_interfaces';
import userStore from '@/user/_store';

@Component({
  components: {
    Asset,
    SinceSelect,
  },
})
export default class Assets extends Vue {
  // properties

  // data
  public assetViews: IAssetView[] = [
    assetsView.assets,
    assetsView.investment,
    assetsView.cash,
    assetsView.retirement,
  ];

  public readonly store: IAssetsStore = store;

  // styles

  // lifecycle
  public async created() {
    if (store.isLoaded === true) {
      return;
    }

    let user: IUser;

    try {
      user = await userStore.getUserAsync();
    } catch (e) {
      // tslint:disable-next-line
      console.log(e);
      return;
    }

    userStore.setUser(user!);

    const startDate: Date = Sinces.getDate(store.maxSince);
    const endDate: Date = Date.Today();
    let assetMap: IAssetMap;

    try {
      assetMap = await tools.getAssetMapAsync(user!.id, startDate, endDate);
    } catch (e) {
      // tslint:disable-next-line
      console.log(e);
      return;
    }

    store.setAssetMap(assetMap);
  }

  // computed

  // methods
  public getAsset(id: string): IAsset {
    return store.assetMap[id];
  }
}
</script>

<style lang="scss" scoped>
</style>
