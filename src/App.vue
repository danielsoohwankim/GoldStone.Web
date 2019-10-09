<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Layout from '@/views/Layout.vue';
import { Theme } from '@/models/common';

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

@include md-register-theme("default", (
  primary: md-get-palette-color(blue, A200), // The primary color of your application
  accent: md-get-palette-color(red, A200), // The accent or secondary color
));

@include md-register-theme("default-dark", (
  primary: md-get-palette-color(blue, A200),
  accent: md-get-palette-color(red, A200),
  theme: dark
));

@include md-register-theme("nav-default", (
  primary: md-get-palette-color(white, A200),
  accent: rgb(0, 120, 212),
));

@include md-register-theme("nav-default-dark", (
  primary: md-get-palette-color(gray, 900),
  accent: rgb(152, 198, 255),
  theme: dark
));

@import "~vue-material/dist/theme/all"; // Apply the theme
// @import "~vue-material/dist/components/MdToolbar/theme";
// @import "~vue-material/dist/components/MdDrawer/theme";
</style>
