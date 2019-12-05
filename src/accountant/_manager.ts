import _ from 'lodash';
import { IAccount, ITransaction } from './_store';
import {
  IGetAccountResponseContract,
  IGetTransactionResponseContract,
} from '@/clients/goldStoneClient';
import { goldStoneException } from '@/shared/GoldStoneException';

class AccountantManager {
  public convertToAccount(item: IGetAccountResponseContract): IAccount {
    return {
      id: item.id,
      userId: item.userId,
    };
  }

  public convertToTransaction(item: IGetTransactionResponseContract): ITransaction {
    return {
      accountId: item.accountId,
      amount: item.amount,
      date: item.date,
      expenseCategory: item.expenseCategory,
      id: item.id,
      name: item.name,
      note: item.note,
      plaidPendingId: item.plaidPendingId,
      plaidTransactionId: item.plaidTransactionId,
      state: item.transactionState,
      tenantId: item.tenantId,
      verifiedDate: item.verifiedDate,
    };
  }
}

export default new AccountantManager();
