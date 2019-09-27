<template>
  <div id="app">
    <AppNavigation/>
    <router-view/>
    <AppFooter/>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import AppFooter from '@/components/layouts/Footer.vue';
import AppNavigation from '@/components/layouts/Navigation.vue';

@Component({
  components: {
    AppFooter,
    AppNavigation,
  }
})

export default class App extends Vue {
  
}
</script>

<style>
</style>
