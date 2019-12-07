import colors from 'material-colors';

interface ILayout {
  Colors: {
    Light: ILayoutColor;
    Dark: ILayoutColor;
  };
}

interface ILayoutColor {
  Test: string;
}

interface ITransaction {
  Colors: {
    Light: ITransactionColor;
    Dark: ITransactionColor;
  };
}

interface ITransactionColor {
  Font: string;
}

export default class AccountantConstants {
  public static Layout: ILayout = {
    Colors: {
      Light: {
        Test: '',
      },
      Dark: {
        Test: '',
      },
    },
  };

  public static Pending: ITransaction = {
    Colors: {
      Light: {
        Font: '',
      },
      Dark: {
        Font: '#ffcf44',
      },
    },
  };

  public static Transaction: ITransaction = {
    Colors: {
      Light: {
        Font: '',
      },
      Dark: {
        Font: 'lightBlue',
      },
    },
  };
}
