<template>
  <div>
    <md-dialog
      :md-active.sync="editDialogView.show"
      style="width: 1000px; height: 500px;"
    >
      <md-dialog-title>Edit</md-dialog-title>

      <div style="width: 200px; float: left">
        <DatePicker />
      </div>
      <div style="float: left;">
        <Select
          title="Asset"
          type="asset"
          :items="assetItems"
          :selectedItemId="editDialogView.assetId"
        />
      </div>
      
      <Select
        title="Account"
        type="account"
        :items="accountItems"
        :selectedItemId="editDialogView.accountId"
      />

      <md-dialog-actions>
        <md-button
          class="md-primary"
          @click="editDialogView.show = false"
        >Close
        </md-button>
        <md-button
          class="md-primary"
          @click="editDialogView.show = false"
        >Save
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-button 
      class="md-primary md-raised"
      @click="toggleShow(true)"
    >Edit
    </md-button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import _ from 'lodash';
import { assetsConstants } from './_data';
import { IAsset, IEditDialogView, ISelectItem } from './_interfaces';
import store from './_store';
import DatePicker from './DatePicker.vue';
import Select from './Select.vue';

@Component({
  components: {
    DatePicker,
    Select,
  },
})
export default class EditDialog extends Vue {
  // @Prop() public readonly asset!: IAsset;
  // data

  // styles

  // computed
  get accountItems(): ISelectItem[] {
    if (!this.asset) {
      return [];
    }

    return _.values(store.assetMap[this.asset.id].accountMap)
      .filter((account) => account.id !== assetsConstants.totalId)
      .map((account) => {
        return {
          id: account.id,
          value: account.name,
        };
    }) as ISelectItem[];
  }

  get asset(): IAsset | undefined {
    if (!this.editDialogView.assetId) {
      return undefined;
    }

    return store.assetMap[this.editDialogView.assetId];
  }

  get assetItems(): ISelectItem[] {
    return _.values(store.assetMap)
      .filter((asset) => asset.id !== assetsConstants.assetsId)
      .map((asset) => {
        return {
          id: asset.id,
          value: asset.title,
        };
      }) as ISelectItem[];
  }

  get editDialogView(): IEditDialogView {
    return store.editDialogView;
  }

  // methods
  public toggleShow(show: boolean): void {
    store.toggleEditDialog(show);
  }
}
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>