import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { AxiosResponse } from 'Axios';
import _ from 'lodash';
import { ExpenseCategory, ExpenseType, TransactionState } from './_data';
import manager from './_manager';
import goldStoneClient from '@/clients/goldStoneClient';
import {
  IGetAccountResponseContract,
  IGetTransactionResponseContract,
  IGetUserResponseContract,
  IPutTransactionRequestContractV1,
} from '@/clients/goldStoneClient';
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
  showPendingEdit: boolean;
}

export interface ITransaction {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  name: string;
  note: string;
  plaidPendingId: string;
  plaidTransactionId: string;
  state: TransactionState;
  tenantId: string;
  verifiedDate: string;
}

// initial state
const initialState: IAccountantState = {
  accounts: {},
  floatingTransactions: {},
  transactions: {},
  selectedTransactionIds: [],
  showPendingEdit: false,
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

  get pendings(): ITransaction[] {
    return this.transactions.filter((t) => t.state === TransactionState.Pending);
  }

  get selectedFloatingPendings(): ITransaction[] {
    return this.selectedFloatingTransactions
      .filter((t) => t.state === TransactionState.Pending);
  }

  get selectedFloatingTransactions(): ITransaction[] {
    const selectedTransactions: ITransaction[] = [];

    this.State.selectedTransactionIds.forEach((id) => {
      if (this.State.floatingTransactions[id]) {
        selectedTransactions.push(this.State.floatingTransactions[id]);
      }
    });

    return selectedTransactions.sort((a, b) => b.date.localeCompare(a.date));
  }

  get showPendingEdit(): boolean {
    return this.State.showPendingEdit;
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

  get getSelectedTransaction() {
    return (id: string): ITransaction =>
      this.selectedFloatingTransactions.filter((t) => t.id === id)[0];
  }

  get getTransaction() {
    return (id: string): ITransaction => this.State.transactions[id];
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
  public resetFloatingTransaction(id: string): void {
    this.context.commit('ResetFloatingTransaction', id);
  }

  @Action
  public resetFloatingTransactions(): void {
    this.context.commit('ResetFloatingTransactions', this.State.selectedTransactionIds);
  }

  @Action
  public async saveFloatingTransactionAsync(id: string): Promise<void> {
    const request: IPutTransactionRequestContractV1 = {
      id,
      date: '',
      value: 0,
    };

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionAsync(request));

    const result = sharedManager.handleApiResponse(response);
    if (result.success === false) {
      return;
    }
  }

  @Action
  public async saveFloatingTransactionsAsync(): Promise<void> {
    // const request: IPutTransactionRequestContractV1 = {
    //   id,
    //   date: '',
    //   value: 0,
    // };

    // const response: AxiosResponse<void | any>
    //   = await loaderAction.sendAsync(() => goldStoneClient.putTransactionAsync(request));

    // const result = sharedManager.handleApiResponse(response);
    // if (result.success === false) {
    //   return;
    // }
  }

  @Action
  public selectTransactions(ids: string[]): void {
    this.context.commit('SelectTransactions', ids);
  }

  @Action
  public togglePendingEdit(show: boolean): void {
    if (this.State.showPendingEdit === show) {
      return;
    }
    if (show === true) {
      // add floating transactions if they do not exist
      // send ids
      this.context.commit('SetFloatingTransactions', this.State.selectedTransactionIds);
    }

    this.context.commit('TogglePendingEdit', show);
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
  private ResetFloatingTransaction(id: string): void {
    this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
  }

  @Mutation
  private ResetFloatingTransactions(ids: string[]): void {
    ids.forEach((id) => {
      this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
    });
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
  private TogglePendingEdit(showPendingEdit: boolean): void {
    this.State.showPendingEdit = showPendingEdit;
  }
}

export default getModule(AccountantStore);
