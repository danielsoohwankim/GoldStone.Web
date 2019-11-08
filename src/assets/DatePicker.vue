<template>
  <div>
    <md-datepicker v-model="selectedDate" md-immediately />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

export default class DatePicker extends Vue {
  // @Prop() public readonly asset!: IAsset;
  // data
  public selectedDate: Date = new Date('2018/03/26');

  // styles

  // computed

  // methods
}
</script>