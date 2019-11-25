<template>
  <div>
    <md-snackbar
      md-position="center"
      md-persistent
      :md-active.sync="snackBarView.show" 
      :md-duration="snackBarView.duration"
      :style="snackBarStyle"
    >
      <span 
        class="message"
        :style="messageStyle"
      >{{ snackBarView.message }}
      </span>
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
import { assetsView } from './_data';
import { ISnackBarView } from '@/layout/_interfaces';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';

@Component
export default class SnackBar extends Vue {
  // properties

  // data

  // styles
  get messageStyle() {
    return {
      color: assetsView.layout.color[layoutStore.theme].text,
    };
  }

  get snackBarStyle() {
    return {
      backgroundColor: assetsView.layout.color[layoutStore.theme].snackBar,
    };
  }

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