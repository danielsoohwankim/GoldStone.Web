<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item">
      <md-field>
        <label for="since">Since</label>
        <md-select
          v-model="selectedSince"
          name="since"
          id="since"
          md-dense
        >
          <md-option
            v-for="since in sinces"
            :key="since"
            :value="since"
            :disabled="isDisabled(since)"
          >
            {{ getSinceString(since) }}
          </md-option>
        </md-select>
      </md-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Since, Sinces } from './_data';
import store from './_store';

@Component
export default class SinceSelect extends Vue {
  // properties

  // data
  public readonly selectedSince = store.maxSince;
  public readonly sinces = Sinces.values().filter((since) => since !== Since.Custom);

  // styles

  // computed

  // methods
  public isDisabled(since: Since): boolean {
    return since >= this.selectedSince;
  }

  public getSinceString(since: Since): string {
    return Sinces.toString(since);
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