<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Layout from '@/layout/Layout.vue';
import { Theme } from '@/layout/_data';

@Component({
  components: {
    Layout,
  },
})
export default class App extends Vue {
  // data
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("light", (
  primary: md-get-palette-color(gray, 500),
  accent: md-get-palette-color(red, A200),
));

@include md-register-theme("dark", (
  primary: md-get-palette-color(gray, 400),
  accent: gray,
  theme: dark,
));

@import "~vue-material/dist/theme/all"; // Apply the theme
// @import "~vue-material/dist/components/MdToolbar/theme";
// @import "~vue-material/dist/components/MdDrawer/theme";
</style>
