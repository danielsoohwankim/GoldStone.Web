<template>
  <div>
    <md-table
      v-model="searched"
      md-card
      md-fixed-header
      md-sort="date"
      md-sort-order="desc"
      :style="scrollStyle"
      @md-selected="onSelect"
    >
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 
            class="md-title"
            :style="titleStyle"
          >Pending
          </h1>
        </div>

        <md-field 
          md-clearable
          class="md-toolbar-section-end"
        >
          <md-input
            placeholder="Search by name"
            v-model="search" 
            @input="searchOnTable"
          />
        </md-field>
      </md-table-toolbar>

      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button">
            <md-icon>delete</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No transactions found"
        :md-description="`No transaction found for this '${search}' query. Try a different search term.`">
      </md-table-empty-state>

      <md-table-row
        slot="md-table-row" 
        slot-scope="{ item }"
        class="md-primary"
        md-selectable="multiple"
        md-auto-select
      >
        <md-table-cell 
          md-label="Users"
        >
          <md-avatar>
            <img
              :src="getUserProfileImage(item.accountId)"
              alt="Avatar"
            >
          </md-avatar>
        </md-table-cell>
        <md-table-cell 
          md-label="Symbol"
          md-sort-by="symbol"
          :style="isSelected(item.id) ? {} : pendingStyle"
        >Symbol
        </md-table-cell>
        <md-table-cell 
          md-label="Date" 
          md-sort-by="date"
          :style="isSelected(item.id) ? {} : pendingStyle"
        >{{ item.date }}
        </md-table-cell>
        <md-table-cell 
          md-label="Name" 
          md-sort-by="name"
          :style="isSelected(item.id) ? {} : pendingStyle"
        >{{ item.name }}
        </md-table-cell>
        <md-table-cell 
          md-label="Amount" 
          md-sort-by="amount"
          :style="isSelected(item.id) ? {} : getAmountStyle(item.amount)"
        >{{ getFormattedAmount(item.amount) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Category" 
          md-sort-by="category"
          :style="isSelected(item.id) ? {} : pendingStyle"
        >{{ item.expenseCategory }}
        </md-table-cell>
        <md-table-cell 
          md-label="Note" 
          md-sort-by="note"
          :style="isSelected(item.id) ? {} : pendingStyle"
        >
          <div style="margin-top: -30px; margin-bottom: -35px;">
            <md-field>
              <md-textarea
                v-model="transactionMap[item.id].note"
                md-autogrow
              ></md-textarea>
            </md-field>
          </div>
        </md-table-cell>
        <md-table-cell 
          md-label="Save" 
        >
          <md-icon :style="saveStyle">
            <!-- <span style="color: white;">{{ AssetView.Icon }}</span> -->
            save
          </md-icon>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AccountConstants from './_constants';
import accountant, { ITransaction } from './_store';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';
import { device } from '@/shared/_tools';
import tenant from '@/tenant/_store';

@Component
export default class Pending extends Vue {
  // data
  public search: string | null = null;
  public searched: ITransaction[] = accountant.pendingTransactions;
  public selectedIds: string[] = [];
  public transactionMap = accountant.transactionMap;

  // style
  get pendingStyle(): object {
    return {
      color: AccountConstants.Pending.Colors[layout.theme].Font,
    };
  }

  get saveStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
    };
  }

  get scrollStyle(): object {
    return (device.isMobile() === true)
      ? { overflowX: 'scroll' }
      : {};
  }

  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
      fontWeight: 'bold',
    };
  }

  // computed

  // methods
  public getAlternateLabel(count): string {
    const plural = (count > 1) ? 's' : '';

    return `${count} transaction${plural} selected`;
  }

  public getAmountStyle(amount: number): object {
    return {
      color: sharedManager.getAmountColor(amount, layout.theme),
    };
  }

  public getFormattedAmount(amount: number): string {
    return sharedManager.getFormattedAmount(amount);
  }

  public getUserProfileImage(accountId: string): string | undefined {
    const account = accountant.getAccount(accountId);
    // todo: remove
    if (!account) {
      return undefined;
    }
    const user = tenant.getUser(account.userId);

    return (user) ? user.profileImageUrl : undefined;
  }

  public isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  public onSelect(transactions: ITransaction[]): void {
    this.selectedIds = transactions.map((t) => t.id);
  }

  public searchOnTable(): void {
    this.searched = this.searchByName(accountant.pendingTransactions, this.search);
  }

  public searchByName(transactions: ITransaction[], term: string | null): ITransaction[] {
    return (term)
      ?  transactions.filter((t) => this.toLower(t.name).includes(this.toLower(term)))
      : transactions;
  }

  public toLower(text: string) {
    return text.toString().toLowerCase();
  }
}
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>
