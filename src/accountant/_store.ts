import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { AxiosResponse } from 'Axios';
import _ from 'lodash';
import { ExpenseCategory, ExpenseType, TransactionState, TransactionType } from './_data';
import manager from './_manager';
import goldStoneClient from '@/clients/goldStoneClient';
import {
  IGetAccountResponseContract,
  IGetTransactionResponseContract,
  IGetUserResponseContract,
  IPutTransactionRequestContractV1,
} from '@/clients/goldStoneClient';
import layout from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import sharedManager from '@/shared/_manager';
import store from '@/shared/_store';
import { Date } from '@/shared/Date';
import tenantManager from '@/tenant/_manager';
import tenant, { IUser } from '@/tenant/_store';

export interface IAccount {
  id: string;
  name: string;
  symbol: string;
  tenantId: string;
  type: ExpenseType;
  userId: string;
}

interface IAccountantState {
  accounts: { [ key: string ]: IAccount };
  floatingTransactions: { [ id: string ]: ITransaction };
  transactions: { [ id: string ]: ITransaction };
  selectedTransactionIds: string[];
  showEditPending: boolean;
}

export interface ITransaction {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  name: string;
  note: string;
  state: TransactionState;
  tenantId: string;
  verified: boolean;
}

// initial state
const initialState: IAccountantState = {
  accounts: {},
  floatingTransactions: {},
  transactions: {},
  selectedTransactionIds: [],
  showEditPending: false,
};

@Module({
  namespaced: true,
  name: 'AccountantStore',
  store,
  dynamic: true,
})
class AccountantStore extends VuexModule {
  // lowercase 'state' is reserved in Vuex
  private State: IAccountantState = _.cloneDeep(initialState);

  get transactions(): ITransaction[] {
    return _.values(this.State.transactions);
  }

  get transactionMap(): { [ id: string]: ITransaction } {
    return this.State.transactions;
  }

  get showEditPending(): boolean {
    return this.State.showEditPending;
  }

  /* getters with parameters */
  get getAccount() {
    return (id: string): IAccount => this.State.accounts[id];
  }

  get getAccountSymbol() {
    return (accountId: string): string =>
      (this.getAccount(accountId))
        ? this.getAccount(accountId).symbol
        : '';
  }

  get getFloatingTransaction() {
    return (id: string): ITransaction => this.State.floatingTransactions[id];
  }

  get getSelectedTransaction() {
    return (id: string): ITransaction =>
      this.context.getters.getSelectedTransactions().filter((t) => t.id === id)[0];
  }

  get getSelectedTransactions() {
    return (type?: TransactionType): ITransaction[] => {
      const selectedTransactions: ITransaction[] = [];

      this.State.selectedTransactionIds.forEach((id) => {
        const transaction: ITransaction = this.State.floatingTransactions[id];

        if (transaction) {
          if (type) {
            if (type === TransactionType.Pending &&
                transaction.state === TransactionState.Pending) {
              // get specified state
              selectedTransactions.push(this.State.floatingTransactions[id]);
            } else if (type !== TransactionType.Pending &&
                transaction.state !== TransactionState.Pending) {
              selectedTransactions.push(this.State.floatingTransactions[id]);
            }
          } else {
            // get all
            selectedTransactions.push(this.State.floatingTransactions[id]);
          }
        }
      });

      return selectedTransactions.sort((a, b) => b.date.localeCompare(a.date));
    };
  }

  get getTransaction() {
    return (id: string): ITransaction => this.State.transactions[id];
  }

  get getTransactions() {
    return (type: TransactionType): ITransaction[] =>
      (type === TransactionType.Pending)
        ? this.transactions.filter((t) => t.state === TransactionState.Pending)
        : this.transactions.filter((t) => t.state !== TransactionState.Pending);
  }

  get getUserProfileImage() {
    return (accountId: string): string | undefined => {
      const account = this.getAccount(accountId);
      const user = tenant.getUser(account.userId);

      return (user) ? user.profileImageUrl : undefined;
    };
  }

  get isSelected() {
    return (id: string): boolean => this.State.selectedTransactionIds.includes(id);
  }

  @Action
  public clear(showSignInButton: boolean): void {
    this.context.commit('Clear', showSignInButton);
  }

  @Action
  public async initAsync(): Promise<void> {
    const startDate: Date = Date.Today().addDays(-2);
    const endDate: Date = Date.Today();
    const getAccountsPromise = goldStoneClient.getAccountsAsync(false, true);
    const getTransactionsPromise = goldStoneClient.getTransactionsAsync(startDate, endDate);
    const getUsersPromise = goldStoneClient.getUsersAsync();
    // @ts-ignore
    const [ getAccountsResponse, getTransactionsResponse, getUsersResponse ]
      = await loaderAction.sendAsync(() => Promise.all([getAccountsPromise, getTransactionsPromise, getUsersPromise]));

    // failed to get accounts
    let result = sharedManager.handleApiResponse(getAccountsResponse);
    if (result.success === false) {
      return;
    }

    // failed to get account transactions
    result = sharedManager.handleApiResponse(getTransactionsResponse);
    if (result.success === false) {
      return;
    }

    // failed to get users
    result = sharedManager.handleApiResponse(getUsersResponse);
    if (result.success === false) {
      return;
    }

    const accountResponses = getAccountsResponse.data as IGetAccountResponseContract[];
    const transactionResponses = getTransactionsResponse.data as IGetTransactionResponseContract[];
    const userResponses = getUsersResponse.data as IGetUserResponseContract[];

    if (!accountResponses || !transactionResponses || !userResponses ||
        accountResponses.length <= 0 || transactionResponses.length <= 0 || userResponses.length <= 0) {
      return;
    }

    const accountList: IAccount[] = accountResponses.map((a) => manager.convertToAccount(a));
    const transactionList: ITransaction[] = transactionResponses.map((c) => manager.convertToTransaction(c));
    const userList: IUser[] = userResponses.map((u) => tenantManager.convertToUser(u));
    const accounts: { [ key: string ]: IAccount } = _.keyBy(accountList, (a) => a.id);
    const transactions: { [ key: string ]: ITransaction } = _.keyBy(transactionList, (c) => c.id);
    const users: { [ key: string ]: IUser } = _.keyBy(userList, (u) => u.id);

    tenant.setUsers(users);
    this.context.commit('Init', { accounts, transactions });
  }

  @Action
  public resetSelectedTransaction(id: string): void {
    this.context.commit('ResetSelectedTransaction', id);
  }

  @Action
  public resetSelectedTransactions(type: TransactionType): void {
    const selectedTransactionIds: string[] =
      this.context.getters
        .getSelectedTransactions(type)
        .map((t) => t.id);

    this.context.commit('ResetSelectedTransactions', selectedTransactionIds);
  }

  @Action
  public async saveSelectedTransactionAsync(id: string): Promise<void> {
    const selectedTransaction: ITransaction =
      this.context.getters.getSelectedTransaction(id);
    const request = manager.converToPutTransactionRequest(selectedTransaction);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionAsync(request));

    const result = sharedManager.handleApiResponse(response);
    if (result.success === false) {
      return;
    }

    layout.setSnackBar({
      isSuccess: true,
      message: 'Saved 1 transaction',
      show: true,
    });

    this.context.commit('SaveTransaction', id);
  }

  @Action
  public async saveSelectedTransactionsAsync(type: TransactionType): Promise<void> {
    const selectedTransactions: ITransaction[] =
      this.context.getters.getSelectedTransactions(type);
    const request: IPutTransactionRequestContractV1[] =
      selectedTransactions
      // only save the transactions that are modified
        .filter((t) => manager.transactionHasChanged(t.id) === true)
        .map((t) => manager.converToPutTransactionRequest(t));

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionsAsync(request));

    const result = sharedManager.handleApiResponse(response);
    if (result.success === false) {
      return;
    }

    const plural = (request.length > 1) ? 's' : '';

    layout.setSnackBar({
      isSuccess: true,
      message: `Saved ${request.length} transaction${plural}`,
      show: true,
    });

    const ids: string[] = selectedTransactions.map((t) => t.id);

    this.context.commit('SaveTransactions', {
      ids,
      type,
    });
  }

  @Action
  public selectTransactions(ids: string[]): void {
    this.context.commit('SelectTransactions', ids);
  }

  @Action
  public toggleEditPending(show: boolean): void {
    if (this.State.showEditPending === show) {
      return;
    }
    if (show === true) {
      // add floating transactions if they do not exist
      // send ids
      this.context.commit('SetFloatingTransactions', this.State.selectedTransactionIds);
    }

    this.context.commit('ToggleEditPending', show);
  }

  @Mutation
  private Clear(showSignInButton: boolean): void {
    const state: IAccountantState = _.cloneDeep(initialState);

    this.State = state;
  }

  @Mutation
  private Init(params: {
    accounts: { [ key: string ]: IAccount },
    transactions: { [ key: string ]: ITransaction } }): void {
    const { accounts, transactions } = params;

    this.State = {
      ...this.State,
      accounts: _.cloneDeep(accounts),
      transactions: _.cloneDeep(transactions),
    };
  }

  @Mutation
  private ResetSelectedTransaction(id: string): void {
    this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
  }

  @Mutation
  private ResetSelectedTransactions(ids: string[]): void {
    ids.forEach((id) => {
      this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
    });
  }

  @Mutation
  private SaveTransaction(id: string): void {
    this.State.transactions[id] = _.cloneDeep(this.State.floatingTransactions[id]);
  }

  @Mutation
  private SaveTransactions(params: {
    ids: string[],
    type: TransactionType,
  }): void {
    const { ids, type } = params;

    ids.forEach((id) => {
      this.State.transactions[id] = _.cloneDeep(this.State.floatingTransactions[id]);
    });

    this.State.selectedTransactionIds.forEach((id) => {
      // deselect rows
      const row = document.getElementById(id);
      // @ts-ignore
      row.click();
    });

    if (type === TransactionType.Pending) {
      this.State.showEditPending = false;
    } else {
      //
    }
  }

  @Mutation
  private SelectTransactions(ids: string[]): void {
    this.State.selectedTransactionIds = _.cloneDeep(ids);
  }

  @Mutation
  private SetFloatingTransactions(ids: string[]): void {
    const floatingTransactions = _.cloneDeep(this.State.floatingTransactions);

    ids.forEach((id) => {
      // don't touch already existing floating transactions.
      // copy only the newly added transactions
      if (!floatingTransactions[id]) {
        floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
      }
    });

    this.State.floatingTransactions = floatingTransactions;
  }

  @Mutation
  private ToggleEditPending(show: boolean): void {
    this.State.showEditPending = show;
  }
}

export default getModule(AccountantStore);
