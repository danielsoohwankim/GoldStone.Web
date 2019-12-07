<template>
  <div v-if="isLoaded === true">
    <Pending />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import accountant from './_store';
import Pending from './Pending.vue';
import Test from './Test.vue';

@Component({
  components: {
    Pending,
  },
})
export default class Accountant extends Vue {
  // data
  public accountant = accountant;

  // lifecycle
  public async mounted(): Promise<void> {
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (accountant.transactions.length > 0) {
      return;
    }

    await accountant.initAsync();
  }

  // computed
  get isLoaded(): boolean {
    return accountant.transactions.length > 0;
  }
}
</script>
