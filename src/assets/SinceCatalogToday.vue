<template>
  <div
    class="asset-catalog" 
    :class="[
      layoutStore.theme, 
      (hover === true) ? `hover-${layoutStore.Theme}` : ''
    ]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <md-list class="asset-catalog-symbol">
      <md-button 
        class="md-plain button"
        :style="buttonStyle"
        @click.prevent="toggleExpandAccount"
      >
        <span
          class="button-text"
          :style="buttonTextStyle">
          {{ this.account.symbol }}
        </span>
      </md-button>
    </md-list>

    <md-list class="asset-catalog-name">
      <md-list-item>
        <span 
          class="asset-catalog-today" 
          style="white-space: normal;"
        >{{ this.account.name }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-since">
      <md-list-item>
        <span class="asset-catalog-today">
          {{ this.Sinces.toString(this.catalog.since) }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-date">
      <md-list-item>
        <div class="asset-catalog-today">
          <span>{{ this.catalog.date }}</span>
          <br />
          <div 
            v-if="this.assetView.name !== this.assetsView.assets.name
            && this.account.symbol !== this.assetsConstants.totalSymbol"
          >
            <div v-if="updatedStatus === this.BaseStatus.Success">
              <span class="updated-date" :style="updatedTimeStyle">
                {{ `Updated ${this.updatedTime}` }}
              </span>
            </div>
            <div v-else>
              <md-icon>
                <span
                  class="update-failure"
                  :style="updatedTimeStyle"
                >
                  error_outline
                </span>
              </md-icon>
              <span
                class="updated-date"
                style="margin-left: -6px;"
                :style="updatedTimeStyle"
              >
                {{ this.updatedStatusMessage }}
              </span>
            </div>
          </div>
        </div>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-balance">
      <md-list-item>
        <span class="asset-catalog-today">
          {{ `$${this.tools.toCurrencyString(this.catalog.balance)}` }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-change">
      <md-list-item>
        <span class="asset-catalog-today">
          <SinceCatalogChange
            :bold="true"
            :catalog="this.catalog"
          />
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import moment from 'moment';
import { assetsConstants, assetsView, Sinces } from './_data';
import { IAccount, ISinceCatalog, IAssetTools, IAssetView } from './_interfaces';
import assetsStore from './_store';
import tools from './_tools';
import SinceCatalogChange from './SinceCatalogChange.vue';
import SinceCatalogHeader from './SinceCatalogHeader.vue';
import { Theme } from '@/layout/_data';
import { ILayoutStore } from '@/layout/_interfaces';
import layoutStore from '@/layout/_store';
import { BaseStatus } from '@/shared/_data';

@Component({
  components: {
    SinceCatalogChange,
  },
})
export default class SinceCatalogToday extends Vue {
  @Prop() public readonly account!: IAccount;
  @Prop() public readonly assetView!: IAssetView;
  @Prop() public readonly catalog!: ISinceCatalog;
  // data
  public readonly assetsConstants = assetsConstants;
  public readonly assetsView = assetsView;
  public readonly BaseStatus = BaseStatus;
  public readonly layoutStore: ILayoutStore = layoutStore;
  public readonly Sinces: Sinces = Sinces;
  public readonly tools: IAssetTools = tools;
  public hover: boolean = false;

  // styles
  get buttonStyle(): object {
    return (this.account.id !== assetsConstants.totalAccountId)
      ? {
        borderColor: this.assetView.color[layoutStore.theme].font,
      } : {
        backgroundColor: this.assetView.color[layoutStore.theme].font,
        borderColor: this.assetView.color[layoutStore.theme].font,
      };
  }

  get buttonTextStyle(): object {
    return (this.account.id !== assetsConstants.totalAccountId)
      ? {
        color: this.assetView.color[layoutStore.theme].font,
      } : {
        color: assetsView.layout.color[layoutStore.theme].buttonText,
      };
  }

  get updatedTimeStyle(): object {
    const updatedStatus: string = this.updatedStatus.toLowerCase();

    return {
      color: assetsView.layout.color[layoutStore.theme][updatedStatus],
    };
  }

  // computed
  get updatedStatus(): BaseStatus {
    if (!this.catalog.updatedTime) {
      return (this.account.isTracked === true)
        ? BaseStatus.Error
        : BaseStatus.Warning;
    }

    const diffMinutes: number = moment().diff(this.catalog.updatedTime, 'minutes');

    return (diffMinutes < assetsConstants.updateToleranceMinutes)
      ? BaseStatus.Success
      : BaseStatus.Warning;
  }

  get updatedStatusMessage(): string {
    if (this.updatedStatus === this.BaseStatus.Warning) {
      return (this.account.isTracked === true)
        ? `Updated ${this.updatedTime}`
        : `No longer tracked`;
    }

    return 'Failed to update';
  }

  get updatedTime(): string {
    return (this.catalog.updatedTime)
      ? this.catalog.updatedTime.format('hh:mm A')
      : '';
  }

  // methods
  public toggleExpandAccount(): void {
    assetsStore.toggleExpandAccount({
      assetName: this.assetView.name,
      accountId: this.account.id,
      expand: !this.account.expand});
  }
}
</script>

<style lang="scss" scoped>
.asset-catalog-today {
  font-weight: bold;
  margin-top: -5px;
}

.button {
  margin-top: 0.3em;
  border: solid;
  border-width: 0.1em;
  border-radius: 5px;
}

.updated-date {
  font-size: 12px;
  font-style: italic;
  font-weight: normal;
}

.button-text {
  font-weight: bold;
}

.update-failure {
  font-size: 18px;
  font-weight: 100;
  margin-left: -8px;
}
</style>
