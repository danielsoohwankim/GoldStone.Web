import colors from 'material-colors';

export interface IAsset {
  color: string;
  icon: string;
  name: string;
  title: string;
}

export class Asset {
  public static investment: IAsset = {
    color: '#dc3545',
    // color: colors.red.a200,
    icon: 'insert_chart_outlined',
    name: 'investment',
    title: 'Investment',
  };

  public static cash: IAsset = {
    color: '#007bff',
    // color: colors.blue.a200,
    icon: 'monetization_on',
    name: 'cash',
    title: 'Cash',
  };

  public static retirement: IAsset = {
    color: '#009933',
    // color: colors.green.a200,
    icon: 'cloud',
    name: 'retirement',
    title: 'Retirement',
  };
}
