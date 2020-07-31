<template>
  <div>
    Redirecting...
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import detect from 'detect.js';

@Component
export default class Colorman extends Vue {
  public mounted(): void {
    const ua = detect.parse(navigator.userAgent);
    const os: string = (ua.os.family && ua.os.family !== null) ? ua.os.family.toLowerCase() : '';
    let url: string = 'https://play.google.com/store/apps/details?id=com.GoldStone.Colorman';
    // tslint:disable-next-line
    console.log(`Operating System: ${os}`);

    if (os.includes('ios') === true ||
        os.includes('mac') === true) {
      url = 'https://apps.apple.com/us/app/id1523943271';
    }

    window.location.href = url;
  }
}
</script>


<style lang="scss" scoped>
</style>
