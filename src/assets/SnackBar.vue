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
import AssetConstants from './_constants';
import { ISnackBarView } from '@/layout/_interfaces';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';

@Component
export default class SnackBar extends Vue {
  // properties

  // data

  // styles
  get messageStyle() {
    return {
      color: AssetConstants.Layout.Color[layout.theme].Text,
    };
  }

  get snackBarStyle() {
    return {
      backgroundColor: AssetConstants.Layout.Color[layout.theme].SnackBar,
    };
  }

  // computed
  get snackBarView(): ISnackBarView {
    return layout.snackBarView;
  }

  // methods
  public onClickDismiss(): void {
    layout.dismissSnackBar();
  }
}
</script>

<style scoped>
.message {
  font-size: 16px;
}
</style>