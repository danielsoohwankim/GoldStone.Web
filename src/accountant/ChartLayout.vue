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
    <div class="separator"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import ChartBar from './ChartBar.vue';
import ChartColumn from './ChartColumn.vue';
import ChartDonut from './ChartDonut.vue';

@Component({
  components: {
    ChartBar,
    ChartColumn,
    ChartDonut,
  },
})
export default class Accountant extends Vue {
  // data

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.donut {
  width: 20%;
  float: left;
}

.column {
  width: 39%;
  float: left;
}

.bar {
  width: 41%;
  float: left;
}

.separator {
  clear: left;
}
</style>
