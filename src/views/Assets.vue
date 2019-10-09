<template>
  <div>
    <Asset :asset="asset.investment" />
    <Asset :asset="asset.cash" />
    <Asset :asset="asset.retirement" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import Asset from '@/components/Asset.vue';
import { Asset as AssetModel } from '@/models/assets.ts';

@Component({
  components: {
    Asset,
  },
})
export default class Assets extends Vue {
  // properties

  // data
  public asset: AssetModel = AssetModel;

  // styles

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
</style>
