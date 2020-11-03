import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  colorPrimary: '#D15E2E',
  colorSecondary: '#316058',

  // UI
  appBg: 'white',
  appContentBg: 'silver',
  appBorderColor: 'grey',
  appBorderRadius: 3,

  // Typography
  fontBase: '"Nunito", sans-serif',
  fontCode: '"IBM Plex Mono", monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: 'white',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 3,

  brandTitle: 'Versita',
  brandUrl: 'https://versita.io',
  brandImage: 'https://versita.io/img/logo.png',
});
