<template>
  <div>
    <SinceSelect :selectedSince="assets.minSince" />
    <AssetTotal />
    <div v-for="assetType in assets.assetTypes" :key="assetType">
      <Asset :assetType="assetType" />
    </div>
    <EditCatalog />
    <div class="edit-button">
      <md-button 
        class="md-primary md-raised"
        @click="toggleEditCatalog()"
        :disabled="tenant.canEditCatalog === false"
      >Edit
      </md-button>
      <md-tooltip
        md-direction="bottom"
        md-delay="400"
      >{{ editCatalogMessage }}
      </md-tooltip>
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
import EditCatalog from './EditCatalog.vue';
import SinceSelect from './SinceSelect.vue';
import SnackBar from './SnackBar.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import { Date } from '@/shared/Date';
import tenant from '@/tenant/_store';

@Component({
  components: {
    Asset,
    AssetTotal,
    EditCatalog,
    SinceSelect,
    SnackBar,
  },
})
export default class Assets extends Vue {
  // properties

  // data
  public readonly assets = assets;
  public readonly AssetType = AssetType;
  public readonly tenant = tenant;

  // styles
  get editButtonStyle(): object {
    return {
      backgroundColor: (tenant.canEditCatalog === true)
        ? AssetConstants.Layout.Color[layout.theme].EditButtonBackground
        : AssetConstants.Layout.Color[layout.theme].DisabledBackground,
    };
  }

  // lifecycle
  public async mounted(): Promise<void> {
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (assets.catalogs.length > 0) {
      return;
    }

    await assets.initAsync();
  }

  // computed
  get editCatalogMessage(): string {
    return (tenant.canEditCatalog === true)
      ? 'Edit catalog'
      : 'Insufficient privilege';
  }

  // methods
  public toggleEditCatalog(): void {
    assets.toggleEditCatalog();
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
