<template>
  <div class="wrapper">
    <md-content md-theme="dark">
      <md-empty-state
        class="background-color"
        md-icon="error"
        md-label="Page Not Found">
      </md-empty-state>
    </md-content>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {
  // data

  // lifecycle

  // computed

  // methods
}
</script>


<style lang="scss" scoped>
.wrapper {
  align-items: center;
  background-color: #2a2a2a;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
}

.background-color {
  background-color: #2a2a2a
}
</style>
