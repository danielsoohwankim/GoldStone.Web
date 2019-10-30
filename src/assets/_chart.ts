import { assetsView } from './_data';
import { IAccount, IAccountCatalog, IAccountCatalogMap, IAsset, IAssetView, IChart } from './_interfaces';
import tools from './_tools';
import layoutStore from '@/layout/_store';
import { Date as GSDate } from '@/shared/Date';

class Chart implements IChart {
  private static options = {
    annotations: {
      textStyle: {
        fontSize: 18,
        bold: true,
      },
    },
    backgroundColor: '',
    chartArea: {
      width: '85%',
      height: '85%',
    },
    hAxis: {
      gridlines: {
        count: 7,
      },
    },
    height: 500,
    legend: 'none',
    series: {
      0: { color: '' },
    },
    title: '',
    titleTextStyle: {
      color: '',
    },
    tooltip: {
      trigger: 'focus',
    },
    vAxis: {
      format: '$#,###',
      textStyle: {
        color: '',
      },
    },
  };

  public drawChart(
    asset: IAsset,
    assetView: IAssetView,
    account: IAccount): void {
    const google: any = asset.google;
    const chart: any = asset.googleChart;
    const data = new google.visualization.DataTable();
    const accountCatalogMap: IAccountCatalogMap = account.accountCatalogMap;
    const catalogMap: Map<string, IAccountCatalog> = accountCatalogMap.catalogMap;
    const minDate: GSDate = new GSDate(accountCatalogMap.minDate!);
    const maxDate: GSDate = new GSDate(accountCatalogMap.maxDate!);
    const sinceDate: GSDate = tools.getDate(asset.selectedChartSince);
    const chartStartDate: GSDate = GSDate.Max(minDate, sinceDate);

    data.addColumn('date', 'Date');
    data.addColumn('number', 'Balance');
    data.addColumn({ type: 'number', role: 'annotation' });

    for (
      let curDate: GSDate = chartStartDate;
      curDate.toString() <= maxDate.toString();
      curDate = curDate.addDays(1)
    ) {
      const accountCatalog: IAccountCatalog | undefined = catalogMap.get(curDate.toString());
      const balance: number = (accountCatalog) ? accountCatalog.balance : 0;
      const date = curDate.toJsDate();
      const row = [date, balance, null];
      data.addRows([row]);
    }

    const numDataPoints = 7;

    this.setAnnotations(data, numDataPoints);

    const formatter = new google.visualization.NumberFormat({
        prefix: '$',
    });
    formatter.format(data, 1);
    formatter.format(data, 2);

    this.setOptions(asset, assetView, account);

    chart.draw(data, Chart.options);
  }

  private setAnnotations(data, numDataPoints): void {
    const numRows = data.getNumberOfRows();
    const valIndex = 1;
    const annotIndex = 2;

    for (let i = 0; i < numDataPoints - 1; i++) {
      const rowIndex = Math.floor(numRows * (i / (numDataPoints - 1)));
      const val = data.getValue(rowIndex, valIndex);

      data.setValue(rowIndex, annotIndex, val);
    }
    // last row
    const lastIndex = numRows - 1;
    const lastVal = data.getValue(lastIndex, valIndex);
    data.setValue(lastIndex, annotIndex, lastVal);
  }

  private setOptions(asset: IAsset, assetView: IAssetView, account: IAccount) {
    Chart.options.backgroundColor = assetsView.layout.color[layoutStore.theme].chartBackground;
    Chart.options.series[0].color = assetView.color[layoutStore.theme].default;
    Chart.options.title = `${account.name} - ${asset.selectedChartSince}`;
    Chart.options.titleTextStyle.color = assetsView.layout.color[layoutStore.theme].text;
    Chart.options.vAxis.textStyle.color = assetsView.layout.color[layoutStore.theme].text;
  }
}

export default new Chart();
