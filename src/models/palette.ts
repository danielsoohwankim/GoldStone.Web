import colorConverter from 'color-convert';
import colors from 'material-colors';
import { Theme } from '@/models/common.ts';

export default class Palette {
  public static default: any = {
    primary: {
      hex(theme: Theme): string {
        if (theme === Theme.Light) {
          return colors.blue.a200;
        } else {
          return colors.blue.a200;
        }
      },
      rgb(theme: Theme): readonly [number, number, number] {
        return colorConverter.hex.rgb(this.hex(theme));
      },
    },
    accent: {
      hex(theme: Theme): string {
        if (theme === Theme.Light) {
          return colors.red.a200;
        } else {
          return colors.red.a200;
        }
      },
      rgb(theme: Theme): readonly [number, number, number] {
        return colorConverter.hex.rgb(this.hex(theme));
      },
    },
    font: {
      hex(theme: Theme): string {
        if (theme === Theme.Light) {
          return `#000000`;
        } else {
          return `#ffffff`;
        }
      },
      rgb(theme: Theme): readonly [number, number, number] {
        return colorConverter.hex.rgb(this.hex(theme));
      },
    },
  };

  public static nav: any = {
    primary: {
      hex(theme: Theme): string {
        if (theme === Theme.Light) {
          return colors.white.a200;
        } else {
          return colors.grey[900];
        }
      },
      rgb(theme: Theme): readonly [number, number, number] {
        return colorConverter.hex.rgb(this.hex(theme));
      },
    },
    accent: {
      hex(theme: Theme): string {
        if (theme === Theme.Light) {
          return `#` + colorConverter.rgb.hex([0, 120, 212]);
        } else {
          return `#` + colorConverter.rgb.hex([152, 198, 255]);
        }
      },
      rgb(theme: Theme): readonly [number, number, number] {
        return colorConverter.hex.rgb(this.hex(theme));
      },
    },
  };
}
