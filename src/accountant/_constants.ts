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

interface IPending {
  Colors: {
    Light: IPendingColor;
    Dark: IPendingColor;
  };
}

interface IPendingColor {
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

  public static Pending: IPending = {
    Colors: {
      Light: {
        Font: '',
      },
      Dark: {
        Font: '#ffcf44',
      },
    },
  };
}
