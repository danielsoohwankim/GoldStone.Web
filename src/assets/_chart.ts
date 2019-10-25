import moment from 'moment';
import { IAccountCatalog, IChartSettings } from './_interfaces';
import layoutStore from '@/layout/_store';

const options = {
  annotations: {
    textStyle: {
      fontSize: 18,
      bold: true,
    },
  },
  backgroundColor: '#424242',
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
    0: { color: 'red' },
  },
  title: '',
  titleTextStyle: {
    color: 'white',
  },
  tooltip: {
    trigger: 'focus',
  },
  vAxis: {
    format: '$#,###',
    textStyle: {
      color: 'white',
    },
  },
};

export default function drawChart(
  chart: any,
  google: any,
  catalogs: IAccountCatalog[],
  settings: IChartSettings) {
  const data = new google.visualization.DataTable();

  data.addColumn('date', 'Date');
  data.addColumn('number', 'Balance');
  data.addColumn({ type: 'number', role: 'annotation' });

  const rows = catalogs.forEach((c) => {
    const date = new Date(moment(c.date).toDate()); // javascript date
    const row = [date, c.balance, null];
    data.addRows([row]);
  });

  const numDataPoints = 7;

  setAnnotations(data, numDataPoints);

  const formatter = new google.visualization.NumberFormat({
      prefix: '$',
  });
  formatter.format(data, 1);
  formatter.format(data, 2);

  setOptions(settings);

  chart.draw(data, options);
}

function setAnnotations(data, numDataPoints): void {
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

function setOptions(settings: IChartSettings) {
  options.series[0].color = settings.assetView.color[layoutStore.theme].default;
  options.title = settings.title;
}
