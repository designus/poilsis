import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import { INPUT_WIDTH } from 'global-styles';

export const styles = (theme: Theme) => createStyles({
  formControl: {
    minWidth: INPUT_WIDTH,
  },
  root: {
    paddingBottom: '1px',
  },
  wrapper: {
    padding: '10px 0',
  },
  select: {
    '&:focus': {
      background: 'none',
    },
  },
});
