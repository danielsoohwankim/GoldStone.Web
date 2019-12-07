import colors from 'material-colors';

interface ILayout {
  Colors: {
    Light: ILayoutColor;
    Dark: ILayoutColor;
  };
}

interface ILayoutColor {
  Accent: string;
  Background: string;
  Font: string;
  Gold: string;
  Primary: string;
  SnackBar: string;
  Stone: string;
  Text: string;
}

interface IHeader {
  Colors: {
    Light: IHeaderColor;
    Dark: IHeaderColor;
  };
}

interface IHeaderColor {
  Background: string;
  Icon: string;
  Theme: string;
}

export default class LayoutConstants {
  public static Layout: ILayout = {
    Colors: {
      Light: {
        Accent: colors.red.a200,
        Background: '#fafafa',
        Font: '#000',
        Gold: '#907200',
        Primary: '',
        SnackBar: colors.grey[300],
        Stone: '#8a898d',
        Text: 'black',
      },
      Dark: {
        Accent: colors.red.a200,
        Background: '#2a2a2a',
        Font: '#fff',
        Gold: '#907200',
        Primary: colors.lightBlue[200],
        SnackBar: colors.grey[800],
        Stone: '#8a898d',
        Text: 'white',
      },
    },
  };

  public static Header: IHeader = {
    Colors: {
      Light: {
        Background: '#fff',
        Icon: '#000',
        Theme: '#0078d4',
      },
      Dark: {
        Background: colors.grey[900],
        Icon: '#fff',
        Theme: '#98c6ff',
      },
    },
  };
}
