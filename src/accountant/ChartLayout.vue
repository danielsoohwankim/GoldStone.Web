<template>
  <div>
    <div class="donut">
      <ChartDonut />
    </div>
    <div class="column">
      <ChartColumn />
    </div>
    <div class="bar">
      <ChartBar />
    </div>
    <div class="separator">
      <ChartLegend />
      <br />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import ChartBar from './ChartBar.vue';
import ChartColumn from './ChartColumn.vue';
import ChartDonut from './ChartDonut.vue';
import ChartLegend from './ChartLegend.vue';

@Component({
  components: {
    ChartBar,
    ChartColumn,
    ChartDonut,
    ChartLegend,
  },
})
export default class ChartLayout extends Vue {
  // data

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.donut {
  float: left;
  height: 450px;
  width: 20%;
}

.column {
  float: left;
  height: 450px;
  margin-left: 10px;
  width: 45%;
}

.bar {
  float: left;
  height: 450px;
  margin-left: -50px;
  width: 35%;
}

.separator {
  clear: left;
}
</style>
