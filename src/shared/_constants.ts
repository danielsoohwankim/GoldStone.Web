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

interface INumber {
  Colors: {
    Light: INumberColor;
    Dark: INumberColor;
  };
}

interface INumberColor {
  Minus: string;
  Neutral: string;
  Plus: string;
}

export default class SharedConstants {
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

  public static Number: INumber = {
    Colors: {
      Light: {
        Minus: colors.red[600],
        Neutral: colors.grey[500],
        Plus: colors.green[600],
      },
      Dark: {
        Minus: colors.red.a200,
        Neutral: colors.blueGrey[300],
        Plus: colors.green.a400,
      },
    },
  };
}
