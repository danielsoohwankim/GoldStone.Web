<template>
  <div class="asset">
    <div class="list">
      <md-list :style="listStyle">
        <md-list-item md-expand :style="listItemStyle">
          <md-icon>
            <span style="color: white;">{{ asset.icon }}</span>
          </md-icon>
          <span class="md-list-item-text asset-title">
            {{ asset.title }}
          </span>

          <md-list slot="md-expand">
            <md-list-item style="margin: -12px -16px;">
              <div class="asset-catalog" :style="scrollStyle">
                <div class="asset-catalog">
                  <md-list class="asset-catalog-symbol">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Symbol</span>
                      </span>
                    </md-subheader>
                  </md-list>

                  <md-list class="asset-catalog-name">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Name</span>
                      </span>
                    </md-subheader>
                  </md-list>

                  <md-list class="asset-catalog-since">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Since</span>
                      </span>
                    </md-subheader>
                  </md-list>

                  <md-list class="asset-catalog-date">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Date</span>
                      </span>
                    </md-subheader>
                  </md-list>

                  <md-list class="asset-catalog-value">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Value</span>
                      </span>
                    </md-subheader>
                  </md-list>

                  <md-list class="asset-catalog-change">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Change</span>
                      </span>
                    </md-subheader>
                  </md-list>

                  <md-list class="asset-catalog-balance">
                    <md-subheader>
                      <span class="asset-catalog-title">
                        <span>Balance</span>
                      </span>
                    </md-subheader>
                  </md-list>
                </div>
                <div class="asset-catalog">
                  <md-list class="asset-catalog-symbol">
                    <md-list-item>
                      <span>Joy</span>
                    </md-list-item>
                  </md-list>

                  <md-list class="asset-catalog-name">
                    <md-list-item>
                      <span style="white-space: normal;">Aaaaaaaaa Eeeeeeee Sssss Ppppppppp Rrrrrrr</span>
                    </md-list-item>
                  </md-list>

                  <md-list class="asset-catalog-since">
                    <md-list-item>
                      Yesterday
                    </md-list-item>
                  </md-list>

                  <md-list class="asset-catalog-date">
                    <md-list-item>
                      <div>
                        <span>2019-10-07</span>
                        <br />
                        <span class="updated-date">Updated 01:01 PM</span>
                      </div>
                    </md-list-item>
                  </md-list>

                  <md-list class="asset-catalog-value">
                    <md-list-item>
                      $100,000.00
                    </md-list-item>
                  </md-list>

                  <md-list class="asset-catalog-change">
                    <md-list-item>
                      +$20,000.00 (50.00%)
                    </md-list-item>
                  </md-list>

                  <md-list class="asset-catalog-balance">
                    <md-list-item>
                      $100,000.00
                    </md-list-item>
                  </md-list>
                </div>
              </div>
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { IAsset } from '@/models/assets.ts';
import { Theme } from '@/models/common.ts';
import layout from '@/store/layout.ts';
import device from '@/tools/device.ts';

@Component
export default class Assets extends Vue {
  @Prop() public asset!: IAsset;

  // data
  public ringtone = 'peace';

  // styles
  get listStyle(): object {
    return {
      backgroundColor: (layout.theme === Theme.Light) ? '#fff' : '#2a2a2a',
    };
  }

  get listItemStyle(): object {
    return {
      backgroundColor: this.asset.color,
    };
  }

  get scrollStyle(): object {
    return (device.isMobile() === true)
      ? { overflowX: 'scroll' }
      : {};
  }

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
$content-width: 100%;

.list {
  width: $content-width;
}

.asset {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  z-index: 0;
}

.asset > .md-list {
  width: $content-width;
  max-width: 100%;
  height: 400px;
  display: inline-block;
  overflow: auto;
  border: 1px solid rgba(#000, .12);
  vertical-align: top;
}

.asset-catalog {
  width: 100%;
  max-width: 100%;
  height: 100%;
  vertical-align: top;
}

.asset-catalog > .md-list {
  height: 60px;
  display: inline-block;
  border: 1px solid rgba(#000, .12);
}

.asset-title {
  color: white;
  font-weight: 500;
  font-size: 1.25rem;
}

.asset-catalog-symbol {
  width: 10%;
  min-width: 100px;
}

.asset-catalog-name {
  width: 20%;
  min-width: 250px;
}

.asset-catalog-since {
  width: 10%;
  min-width: 100px;
}

.asset-catalog-date {
  width: 13%;
  min-width: 150px;
}

.asset-catalog-value {
  width: 15%;
  min-width: 150px;
}

.asset-catalog-change {
  width: 17%;
  min-width: 200px;
}

.asset-catalog-balance {
  width: 15%;
  min-width: 150px;
}

.asset-catalog-title {
  font-size: 16px; 
  font-weight: bold;
}

.asset-catalog-title span {
  vertical-align: middle;
}

.updated-date {
  font-size: 12px;
  font-style: italic;
}
</style>
