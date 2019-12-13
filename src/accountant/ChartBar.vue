<template>
  <div>
    <GChart
      type="BarChart"
      version="45.2"
      :data="null"
      @ready="onChartReady"
    />
  </div>
</template>

<script lang="ts">
import { GChart } from 'vue-google-charts';
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import moment from 'moment';
import AccountantConstants from './_constants';
import { ExpenseCategory } from './_data';
import manager from './_manager';
import accountant from './_store';
import LayoutConstants from '@/layout/_constants';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';
import { DATE_FORMAT } from '@/shared/Date';

@Component({
  components: {
    GChart,
  },
})
export default class ChartBar extends Vue {
  // data
  private readonly chartCategories: ExpenseCategory[] = manager.getChartCategories();
  private gchart;
  private google;
  private options = {
    title: 'Monthly Total',
      titleTextStyle: {
        fontSize: 22,
        color: 'white',
      },
      backgroundColor: '',
      // legend: {
      //   textStyle: {
      //     color: textColor,
      //     fontSize: 11,
      //   },
      //   position: 'bottom',
      //   pagingTextStyle: {
      //     color: textColor
      //   },
      //   scrollArrows:{
      //     activeColor: palette.primary.main,
      //     inactiveColor: palette.disabled,
      //   },
      // },
      legend: 'none',
      chartArea: {
        width: '80%',
        height: '80%',
      },
      bar: { groupWidth: '60%' },
      isStacked: true,
      tooltip: { isHtml: true }, // Use an HTML tooltip.
      hAxis: {
        textStyle: {
          color: 'white',
        },
        format: '$###,##0',
        viewWindowMode: 'maximized',
      },
      vAxis: {
        textStyle: {
          color: 'white',
        },
      },
      series: (() => {
        const series: any = [];

        this.chartCategories.forEach((category) => {
          series.push({
            color: AccountantConstants.Chart.Colors[layout.theme][category],
          });
        });

        return series;
      })(),
      annotations: {
        textStyle: {
          color: 'white',
          bold: true,
          auraColor: '#303030',
        },
        alwaysOutside: true,
      },
      animation: {
        startup: true,
        duration: 1000,
        easing: 'out',
      },
  };

  // styles

  // computed

  // methods
  public onChartReady(gchart, google): void {
    this.gchart = gchart;
    this.google = google;

    this.drawChart();
  }

  private drawChart(): void {
    const data = new this.google.visualization.DataTable();

    data.addColumn('string', 'Month');
    this.chartCategories.forEach((category) => {
      data.addColumn('number', category);
      data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });
    });
    data.addColumn({ type: 'string', role: 'annotation' });

    for (let i: number = 2; i >= 0; i--) {
      const row = this.getChartRow(accountant.selectedYear, accountant.selectedMonth - i);
      data.addRows([row]);
    }

    this.setOptions();

    this.gchart.draw(data, this.options);
  }

  private getChartRow(year: number, month: number) {
    const startDate = moment().year(year).month(month - 1).format(DATE_FORMAT);
    const endDate = moment(startDate).endOf('month').format(DATE_FORMAT);

    const row: any = [ sharedManager.getMonthAbbr(month) ];
    this.chartCategories.forEach((category) => {
      const total: number = accountant.getTotal({
        category,
        startDate,
        endDate,
      });

      row.push(total);
      row.push(this.getTooltipString(category, total, month));
    });

    const monthlyTotal: number = accountant.getTotal({
      startDate,
      endDate,
    });

    row.push(sharedManager.toCurrencyString(monthlyTotal)); // annotation

    return row;
  }

  private getTooltipString(
    category: ExpenseCategory,
    amount: number,
    month: number,
  ): string {
    const amountStr: string = sharedManager.toCurrencyString(amount);

    return `
      <div style="color: black; margin: 7px; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">
        <b>${month}</b><br style="line-height: 18px;" />${category}:&nbsp;<b>${amount}</b>
      </div>
      `;
  }

  private setOptions(): void {
    //
  }
}
</script>

<style lang="scss" scoped>
</style>
