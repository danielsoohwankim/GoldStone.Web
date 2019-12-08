import colors from 'material-colors';

interface ILayout {
  Colors: {
    Light: ILayoutColor;
    Dark: ILayoutColor;
  };
}

interface ILayoutColor {
  Pending: string;
  Selected: string;
  Settled: string;
  Merged: string;
  Verified: string;
}

export default class AccountantConstants {
  public static Layout: ILayout = {
    Colors: {
      Light: {
        Pending: '',
        Selected: '#fff',
        Settled: '',
        Merged: '',
        Verified: '',
      },
      Dark: {
        Pending: '#ffcf44',
        Selected: '#000',
        Settled: '#ffcf44',
        Merged: colors.lightBlue[200],
        Verified: '',
      },
    },
  };
}
