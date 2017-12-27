import {INPUT_FOCUSED_COLOR, INPUT_BORDER_COLOR } from './colors';

export const INPUT_STYLE_MIXIN = {
  underline: {
    '&:hover:before': {
      backgroundColor: `${INPUT_FOCUSED_COLOR}!important`,
    },
    '&:before': {
      backgroundColor: INPUT_BORDER_COLOR,
    },
  },
  focused: {
    '&:after': {
      backgroundColor: INPUT_FOCUSED_COLOR,
    },
  },
};