<template>
  <div>
    <SinceSelect :selectedSince="assets.minSince" />
    <AssetTotal />
    <div v-for="assetType in assets.assetTypes" :key="assetType">
      <Asset :assetType="assetType" />
    </div>
    <EditDialog />
    <div class="edit-button">
      <md-button 
        class="md-primary md-raised"
        @click="toggleEditDialog()"
        :style="editButtonStyle"
      >Edit
      </md-button>
    </div>
    <SnackBar />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import manager from './_manager';
import assets, { AssetType } from './_store';
import Asset from './Asset.vue';
import AssetTotal from './AssetTotal.vue';
import EditDialog from './EditDialog.vue';
import SinceSelect from './SinceSelect.vue';
import SnackBar from './SnackBar.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import { Date } from '@/shared/Date';
import tenantStore from '@/tenant/_store';

@Component({
  components: {
    Asset,
    AssetTotal,
    EditDialog,
    SinceSelect,
    SnackBar,
  },
})
export default class Assets extends Vue {
  // properties

  // data
  public readonly assets = assets;
  public readonly AssetType = AssetType;

  // styles
  get editButtonStyle(): object {
    return {
      backgroundColor: AssetConstants.Layout.Color[layout.theme].EditButtonBackground,
    };
  }

  // lifecycle
  public async mounted() {
    // todo: do we need mounted()?
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (assets.catalogs.length > 0) {
      return;
    }

    // let assetMap: IAssetMap;

    // try {
    //   assetMap = await tools.getAssetMapAsync(store.minSince);
    // } catch (e) {
    //   tools.handleApiErrorAsync(e);
    //   return;
    // }

    // store.setAssetMap(assetMap);
  }

  // computed

  // methods
  public toggleEditDialog(): void {
    assets.toggleEditDialog();
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
