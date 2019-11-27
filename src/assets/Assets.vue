<template>
  <div>
    <SinceSelect
      :selectedSince="store.minSince"
    />
    <div v-for="assetView in assetViews" :key="assetView.name">
      <Asset 
        :asset="getAsset(assetView.id)"
        :assetView="assetView"
        :expanded="assetView.expanded"
      />
    </div>
    <EditDialog />
    <div class="edit-button">
      <md-button 
        class="md-primary md-raised"
        @click="toggleShow(true)"
        :style="editButtonStyle"
      >Edit
      </md-button>
    </div>
    <SnackBar />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsConstants, assetsView, Sinces } from './_data';
import { IAsset, IAssetMap, IAssetView, IAssetsStore, IToggleEditDialog } from './_interfaces';
import store from './_store';
import tools from './_tools';
import Asset from './Asset.vue';
import EditDialog from './EditDialog.vue';
import SinceSelect from './SinceSelect.vue';
import SnackBar from './SnackBar.vue';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import { Date } from '@/shared/Date';
import tenantStore from '@/tenant/_store';

@Component({
  components: {
    Asset,
    EditDialog,
    SinceSelect,
    SnackBar,
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
  get editButtonStyle(): object {
    return {
      backgroundColor: assetsView.layout.color[layoutStore.theme].editButtonBackground,
    };
  }

  // lifecycle
  public async mounted() {
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (store.isLoaded === true) {
      return;
    }

    let assetMap: IAssetMap;

    try {
      assetMap = await tools.getAssetMapAsync(store.minSince);
    } catch (e) {
      tools.handleApiErrorAsync(e);
      return;
    }

    store.setAssetMap(assetMap);
  }

  // computed

  // methods
  public getAsset(id: string): IAsset {
    return store.assetMap[id];
  }

  public toggleShow(show: boolean): void {
    store.toggleEditDialog({
      show,
    });
  }
}
</script>

<style lang="scss" scoped>
.edit-button {
  padding-top: 10px;
  position: absolute;
  right: 10px;
}
</style>
