<template>
  <div>
    <md-dialog
      class="dialog"
      :md-active="editDialogView.show"
    >
      <md-dialog-title>Edit</md-dialog-title>
      <div class="wrapper">
        <md-datepicker 
          v-model="date"
          md-immediately
        />
        <md-field>
          <label :for="assetLabel">{{ assetLabel }}</label>
          <md-select
            :id="assetLabel"
            :name="assetLabel"
            :placeholder="assetLabel"
            :value="selectedAssetName"
          >
            <div
              v-for="asset in assets"
              :key="asset.id"
              @click.prevent="onSelectAsset(asset)"
            >
              <md-option :value="asset.title">
                {{ asset.title }}
              </md-option>
            </div>
          </md-select>
        </md-field>
        <md-field>
          <label :for="accountLabel">{{ accountLabel }}</label>
          <md-select
            :disabled="!selectedAsset"
            :id="accountLabel"
            :name="accountLabel"
            :placeholder="accountLabel"
            :value="selectedAccountName"
          >
            <div
              v-for="account in accounts"
              :key="account.id"
              @click.prevent="onSelectAccount(account)"
            >
              <md-option :value="account.name">
                {{ account.name }}
              </md-option>
            </div>
          </md-select>
        </md-field>
        <md-field md-clearable>
          <label>Balance</label>
          <span class="md-prefix">$</span>
          <md-input
            v-model="balance"
            @keypress="isNumber($event)"
          ></md-input>
        </md-field>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-primary"
          :disabled="isResetClickable === false"
          @click="onClickReset()"
        >Reset
        </md-button>
        <md-button
          :style="closeStyle"
          @click="toggleShow(false)"
        >Close
        </md-button>
        <md-button
          :style="saveButtonStyle"
          :disabled="isSaveDisabled === true"
          @click="save()"
        >Save
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import { assetsConstants, assetsView } from './_data';
import { IAccount, IAccountCatalog, IAsset, IEditDialogView } from './_interfaces';
import store from './_store';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import { Date } from '@/shared/Date';

@Component
export default class EditDialog extends Vue {
  // data
  public accountLabel: string = 'Account';
  public assetLabel: string = 'Asset';
  public date = Date.Today().toJsDate();
  private Balance: string | null = null;

  @Watch('date')
  public onDateChange(newDate, oldDate) {
    if (!newDate || !this.selectedAsset || !this.selectedAccount) {
      return;
    }

    const date: string = Date.toDate(this.date).toString();
    const catalog: IAccountCatalog
      = store
        .assetMap[this.selectedAsset.id]
        .accountMap[this.selectedAccount.id]
        .accountCatalogMap
        .catalogMap[date];

    this.Balance = (catalog) ? `${catalog.balance}` : this.Balance;
  }

  // styles
  get closeStyle() {
    return {
      color: (layoutStore.theme === Theme.Light) ? 'black' : 'white',
    };
  }

  get errorMessage() {
    return {
      color: assetsView.layout.color[layoutStore.theme].error,
      fontSize: '17px',
      paddingRight: '22px',
    };
  }

  get saveButtonStyle() {
    return (this.isSaveDisabled === true) ? {
      color: `#BDBDBD`,
    } : {
      color: `#EC407A`,
    };
  }

  // computed
  get accounts(): IAccount[] {
    if (!this.selectedAsset) {
      return [];
    }

    return _.values(store.assetMap[this.selectedAsset.id].accountMap)
            .filter((account) => account.id !== assetsConstants.totalId);
  }

  get assets(): IAsset[] {
    return _.values(store.assetMap)
            .filter((asset) => asset.id !== assetsConstants.assetsId);
  }

  get balance(): string | null {
    return this.Balance;
  }

  set balance(balance: string | null) {
    this.Balance = balance;
  }

  get editDialogView(): IEditDialogView {
    return store.editDialogView;
  }

  get isResetClickable(): boolean {
    return (this.date &&
      (Date.toDate(this.date).toString() !== Date.Today().toString()))
      || (this.selectedAsset !== undefined)
      || (this.selectedAccount !== undefined)
      || (this.balance !== null);
  }

  get isSaveDisabled(): boolean {
    return !this.date
      || this.selectedAsset === undefined
      || this.selectedAccount === undefined
      || this.balance === null
      || this.balance === '';
  }

  get selectedAccount(): IAccount | undefined {
    const { assetAccountMap, assetId } = this.editDialogView;

    if (!assetId || !assetAccountMap[assetId]) {
      return undefined;
    }

    const accountId: string = assetAccountMap[assetId]!;

    return store.assetMap[assetId].accountMap[accountId];
  }

  get selectedAsset(): IAsset | undefined {
    if (!this.editDialogView.assetId) {
      return undefined;
    }

    return store.assetMap[this.editDialogView.assetId];
  }

  @Watch('selectedAccountId')
  public onSelectedAccountIdChange(newId: string, oldId: string) {
    if (!newId || !this.selectedAsset) {
      return;
    }

    const date: string = Date.toDate(this.date).toString();
    const catalog: IAccountCatalog
      = store
        .assetMap[this.selectedAsset.id]
        .accountMap[newId]
        .accountCatalogMap
        .catalogMap[date];

    this.Balance = (catalog) ? `${catalog.balance}` : this.Balance;
  }

  get selectedAccountId(): string | undefined {
    if (!this.selectedAsset) {
      return undefined;
    }

    return this.editDialogView.assetAccountMap[this.selectedAsset.id!];
  }

  get selectedAccountName(): string | undefined {
    if (!this.selectedAccountId) {
      return undefined;
    }

    const account: IAccount =
      store.assetMap[this.selectedAsset!.id].accountMap[this.selectedAccountId!];

    return account.name;
  }

  get selectedAssetName(): string | undefined {
    return (this.selectedAsset) ? this.selectedAsset.title : undefined;
  }

  // methods
  public onClickReset(): void {
    store.resetEditView();
    this.date = Date.Today().toJsDate();
    this.Balance = null;
  }

  public onSelectAccount(account: IAccount): void {
    if (this.editDialogView[this.selectedAsset!.id] === account.id) {
      return;
    }

    store.selectEditItem({
      type: 'account',
      id: account.id,
      value: account.name,
    });
  }

  public onSelectAsset(asset: IAsset): void {
    if (this.editDialogView.assetId === asset.id) {
      return;
    }

    store.selectEditItem({
      type: 'asset',
      id: asset.id,
      value: asset.name,
    });
  }

  public toggleShow(show: boolean): void {
    store.toggleEditDialog({
      show,
    });
  }

  public isNumber($event: any) {
    // console.log($event.keyCode); //keyCodes value
    const keyCode = ($event.keyCode ? $event.keyCode : $event.which);

    // only allow number and one dot
    if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.balance!.indexOf('.') !== -1)) { // 46 is dot
      $event.preventDefault();
    }

    // restrict to 2 decimal places
    if (this.balance !== null
      && this.balance.indexOf('.') > -1
      && (this.balance.split('.')[1].length > 1)) {
      $event.preventDefault();
    }
  }

  public save(): void {
    if (!this.selectedAsset || !this.selectedAccount || this.balance === null) {
      return;
    }

    store.updateCatalog({
      assetId: this.selectedAsset.id,
      accountId: this.selectedAccountId!,
      balance: parseFloat(this.balance!),
      date: Date.toDate(this.date),
    });
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  height: 420px;
  width: 300px;
}

.wrapper {
  padding: 0 15px 0 15px;
}
</style>