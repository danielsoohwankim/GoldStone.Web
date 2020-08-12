<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import detect from 'detect.js';

@Component
export default class Redirect extends Vue {
  public mounted(): void {
    const ua = detect.parse(navigator.userAgent);
    const os: string = (ua.os.family && ua.os.family !== null) ? ua.os.family.toLowerCase() : '';
    let url: string = 'https://play.google.com/store/apps/details?id=com.GoldStone.Colorman';
    // tslint:disable-next-line
    console.log(`Operating System: ${os}`);

    const locale: string = this.getLocale();

    if (os.includes('ios') === true ||
        os.includes('mac') === true) {
      url = `https://apps.apple.com/${locale}/app/id1523943271`;
    } else {
      const hl: string = (locale === 'us')
        ? 'en_us' : (locale === 'kr') ? 'kr_kr' : locale === 'jp' ? 'ja_jp' : 'en_us';
      url = `${url}&hl=${hl}`;
    }

    window.location.href = url;
  }

  private getLocale(): string {
    const locale: string | null = this.getQueryVariable('locale');
    return (!locale) ? 'us' : locale;
  }

  private getQueryVariable(variable): string | null {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (const pairs of vars) {
        const pair = pairs.split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }

    return null;
  }
}
</script>


<style lang="scss" scoped>
</style>
