<template>
  <div>
    <md-button 
      id="setting-button" 
      @click.prevent="store.toggleSetting(!store.showSetting)"
      class="setting-button"
    >
      <md-icon :style="settingStyle">
        settings_applications
      </md-icon>
    </md-button>

    <div id="setting-panel">
      <div 
        :class="settingLayoutClass" 
        class="full-control"
        v-if="store.showSetting"
      >
        <md-list>
          <md-subheader :style="settingStyle">Settings</md-subheader>

          <md-list-item>
            <md-icon :style="iconStyle">wb_sunny</md-icon>
            <span class="md-list-item-text">{{ themeText }}</span>
            <md-switch 
              v-model="theme" 
              true-value="light"
              false-value="dark"
              class="md-accent" 
              :md-theme="theme"
            />
          </md-list-item>
          <md-list-item>
            <md-avatar class="md-small" style="margin-right: 32px;">
              <img :src="tenant.profileImageUrl" alt="Avatar" />
            </md-avatar>
            <span class="md-list-item-text">Signed In</span>
            <md-switch
              v-model="signedIn"
              class="md-accent"
              @click="test()"
              :md-theme="theme"
            />
          </md-list-item>
        </md-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { Theme } from './_data';
import { ILayoutStore } from './_interfaces';
import store from './_store';
import { device } from '@/shared/_tools';
import tenant from '@/tenant/_store';

@Component
export default class LayoutSetting extends Vue {
  @Prop(Object) public readonly settingStyle!: object;
  // data
  public theme: Theme = store.theme;
  public store: ILayoutStore = store;
  public tenant = tenant;
  public signedIn: boolean = true;

  // styles
  get iconStyle(): object {
    return {
      color: (store.theme === Theme.Light)
        ? '#000' : '#fff',
    };
  }

  get settingLayoutClass(): string {
    return (device.isMobile() === false)
      ? 'setting-layout' : 'setting-layout-mobile';
  }

  // computed
  get themeText(): string {
    return (this.theme === Theme.Light) ? 'Light' : 'Dark';
  }

  // methods
  @Watch('theme')
  public toggleTheme(curTheme: Theme, prevTheme: Theme): void {
    store.setTheme(curTheme);
  }

  @Watch('signedIn')
  public async toggleSignIn(cur: boolean, prev: boolean): Promise<void> {
    await tenant.signOut();
  }
}
</script>

<style lang="scss" scoped>
.setting-button {
  left: 10px;
  min-width: 30px;
}

.setting-layout {
  position: absolute; 
  top: 64px; 
  right: 0;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.setting-layout-mobile {
  position: absolute; 
  top: 56px; 
  right: 0;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.full-control > .md-list {
    width: 250px;
    max-width: 100%;
    height: 250px;
    display: inline-block;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
    vertical-align: top;
  }
</style>
