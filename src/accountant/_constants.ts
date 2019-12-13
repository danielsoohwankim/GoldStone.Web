import colors from 'material-colors';

interface ICategory {
  Colors: {
    Dark: ICategoryColor;
    Light: ICategoryColor;
  };
}

interface ICategoryColor {
  Grocery: string;
  Meal: string;
  Others: string;
  Recreation: string;
  Shopping: string;
  Special: string;
  Utility: string;
  Vehicle: string;
}

interface IChart {
  Colors: {
    Dark: IChartColor;
    Light: IChartColor;
  };
  Height: number;
}

interface IChartColor {
  AuraBar: string;
  AuraColumn: string;
  Border: string;
  Text: string;
  Title: string;
}

interface ILayout {
  Colors: {
    Dark: ILayoutColor;
    Light: ILayoutColor;
  };
}

interface ILayoutColor {
  Pending: string;
  Selected: string;
  Settled: string;
  Merged: string;
  Verified: string;
}

interface ITransactions {
  TableSize: number;
}

export default class AccountantConstants {
  public static Category: ICategory = {
    Colors: {
      Dark: {
        Grocery: colors.green[600],
        Meal: colors.cyan[500],
        Others: colors.blueGrey[300],
        Recreation: colors.lightBlue[700],
        Shopping: colors.red[600],
        Special: '',
        Utility: colors.orange[500],
        Vehicle: colors.yellow[500],
      },
      Light: {
        Grocery: '#28a745',
        Meal: '#17a2b8',
        Others: '#6c757d',
        Recreation: '#007bff',
        Shopping: '#dc3545',
        Special: '#343a40',
        Utility: '#990099',
        Vehicle: '#ffc107',
      },
    },
  };

  public static Chart: IChart = {
    Colors: {
      Dark: {
        AuraBar: '#303030',
        AuraColumn: colors.grey[200],
        Border: colors.grey[500],
        Text: colors.grey[400],
        Title: colors.grey[300],
      },
      Light: {
        AuraBar: '',
        AuraColumn: '',
        Border: '',
        Text: '',
        Title: '',
      },
    },
    Height: 450,
  };

  public static Layout: ILayout = {
    Colors: {
      Dark: {
        Pending: '#ffcf44',
        Selected: '#000',
        Settled: '#ffcf44',
        Merged: colors.lightBlue[200],
        Verified: '',
      },
      Light: {
        Pending: '',
        Selected: '#fff',
        Settled: '',
        Merged: '',
        Verified: '',
      },
    },
  };

  public static Transactions: ITransactions = {
    TableSize: 15,
  };
}
