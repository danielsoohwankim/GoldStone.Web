<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item">
      <md-field>
        <label :for="title">{{ title }}</label>
        <md-select
          :id="title"
          :name="title"
          :value="selectedItemValue"
          :placeholder="title"
        >
          <div
            v-for="item in items"
            :key="item.id"
            @click.prevent="onSelect(item)"
          >
            <md-option
              :value="item.value"
            >
              {{ item.value }}
            </md-option>
          </div>
        </md-select>
      </md-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { ISelectItem } from './_interfaces';
import store from './_store';

@Component
export default class Select extends Vue {
  // properties
  @Prop() public readonly items!: ISelectItem[];
  @Prop() public readonly selectedItemId: string | undefined;
  @Prop() public readonly title!: string;
  @Prop() public readonly type!: string;

  // data

  // styles

  // computed
  get selectedItemValue(): string | undefined {
    return (this.selectedItemId)
      ? this.items.filter((item) => item.id === this.selectedItemId)[0].value
      : undefined;
  }

  // methods
  public onSelect(item: ISelectItem): void {
    if (this.selectedItemId === item.id) {
      return;
    }

    store.selectEditItem({
      type: this.type,
      id: item.id,
      value: item.value,
    });
  }
}
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 180px;
  float: right;
  margin-top: -8px; 
  margin-bottom: 4px;
}
</style>