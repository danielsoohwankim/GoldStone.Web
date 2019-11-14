<template>
  <div
    class="overlay"
    v-if="store.showLoader"
  >
    <div class="loader">
      <PacmanLoader />
      <div class="text">Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';
import { ILayoutStore } from './_interfaces';
import store from './_store';

@Component({
  components: {
    PacmanLoader,
  },
})
export default class Loader extends Vue {
  // data
  public store: ILayoutStore = store;
}
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  margin: auto;
  top: 50%;
  left: 50%;
}

.text {
  color: white;
  margin-top: 5px;
}

.overlay {
  background-color: rgba(0,0,0,0.5);
  position:fixed;
  left:0;
  top: 0;
  width:100%;
  height:100%;
  z-index: 50;
}
</style>