import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import { ERROR_COLOR, INPUT_WIDTH } from 'global-styles';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    padding: '10px 0',
  },
  formControl: {
    width: INPUT_WIDTH,
  },
  hidden: {
    display: 'none',
  },
  error: {
    '&:after': {
      backgroundColor: ERROR_COLOR,
    },
  },
});
