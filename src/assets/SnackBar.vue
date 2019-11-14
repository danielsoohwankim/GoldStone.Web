<template>
  <div>
    <md-snackbar 
      md-position="center"
      md-persistent
      :md-active.sync="snackBarView.show" 
      :md-duration="snackBarView.duration"
    >
      <span class="message">{{ snackBarView.message }}</span>
      <md-button 
        class="md-accent"
        @click.prevent="onClickDismiss()"
      >
        Dismiss
      </md-button>
    </md-snackbar>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { ISnackBarView } from '@/layout/_interfaces';
import layoutStore from '@/layout/_store';

@Component
export default class SnackBar extends Vue {
  // properties

  // data

  // styles

  // computed
  get snackBarView(): ISnackBarView {
    return layoutStore.snackBarView;
  }

  // methods
  public onClickDismiss(): void {
    layoutStore.dismissSnackBar();
  }
}
</script>

<style scoped>
.message {
  font-size: 16px;
}
</style>