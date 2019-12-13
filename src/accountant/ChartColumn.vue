<template>
  <div>
    <GChart
      type="ColumnChart"
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
export default class ChartColumn extends Vue {
  // data
  private readonly chartCategories: ExpenseCategory[] = manager.getChartCategories();
  private gchart;
  private google;
  private options = {
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    annotations: {
      textStyle: {
        bold: true,
        auraColor: '',
      },
      alwaysOutside: true,
    },
    backgroundColor: '',
    chartArea: {
      width: '85%',
      height: '85%',
    },
    hAxis: {
      textPosition: 'none',
      textStyle: {
        color: '',
      },
    },
    height: AccountantConstants.Chart.Height,
    legend: 'none',
    title: 'Spendings',
    titleTextStyle: {
      fontSize: 22,
      color: '',
    },
    tooltip: { isHtml: true }, // Use an HTML tooltip.
    vAxis: {
      textStyle: {
        color: '',
      },
      format: '$###,##0',
    },
  };

  // styles

  // computed
  get curEndDate(): string {
    return moment(this.curStartDate).endOf('month').format(DATE_FORMAT);
  }

  get curStartDate(): string {
    // month is zero indexed
    return moment([accountant.selectedYear, accountant.selectedMonth]).format(DATE_FORMAT);
  }

  get prevEndDate(): string {
    return moment(this.prevStartDate).endOf('month').format(DATE_FORMAT);
  }

  get prevStartDate(): string {
    // month is zero indexed
    return moment([accountant.selectedYear, accountant.selectedMonth - 1]).format(DATE_FORMAT);
  }

  // methods
  public getTooltipString(
    category: ExpenseCategory,
    amount: number,
    month: number,
  ): string {
    const amountStr: string = sharedManager.toCurrencyString(amount);

    return `
      <div style="color: black; margin: 7px; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">
        <b>${category}</b><br style="line-height: 18px;" />
        ${sharedManager.getMonthAbbr(month)}:&nbsp;<b>$${amountStr}</b>
      </div>
      `;
  }

  public onChartReady(gchart, google): void {
    this.gchart = gchart;
    this.google = google;

    this.drawChart();
  }

  private drawChart(): void {
    const data = new this.google.visualization.DataTable();

    data.addColumn('string', 'Category');
    data.addColumn('number', sharedManager.getMonthAbbr(accountant.selectedMonth - 1));
    data.addColumn({ type: 'string', role: 'style' });
    data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });
    data.addColumn('number', sharedManager.getMonthAbbr(accountant.selectedMonth));
    data.addColumn({ type: 'string', role: 'style' });
    data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });
    data.addColumn({ type: 'string', role: 'annotation' });

    this.chartCategories.forEach((category) => {
      const prevTotal: number = accountant.getTotal({
        category,
        startDate: this.prevStartDate,
        endDate: this.prevEndDate,
      });
      const curTotal: number = accountant.getTotal({
        category,
        startDate: this.curStartDate,
        endDate: this.curEndDate,
      });
      const color: string = AccountantConstants.Category.Colors[layout.theme][category];
      const row = [
        category,
        prevTotal,
        sharedManager.shadeBlendChart(color),
        this.getTooltipString(category, prevTotal, accountant.selectedMonth - 1),
        curTotal,
        color,
        this.getTooltipString(category, curTotal, accountant.selectedMonth),
        '$' + sharedManager.toCurrencyString(curTotal),
      ];

      data.addRows([row]);
    });

    this.setOptions();

    this.gchart.draw(data, this.options);
  }

  private setOptions(): void {
    this.options.annotations.textStyle.auraColor = AccountantConstants.Chart.Colors[layout.theme].Aura;
    this.options.hAxis.textStyle.color = AccountantConstants.Chart.Colors[layout.theme].Text;
    this.options.titleTextStyle.color = AccountantConstants.Chart.Colors[layout.theme].Text;
    this.options.vAxis.textStyle.color = AccountantConstants.Chart.Colors[layout.theme].Text;
  }
}
</script>

<style lang="scss" scoped>
</style>
