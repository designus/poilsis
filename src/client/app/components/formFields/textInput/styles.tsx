import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';
import { ERROR_COLOR, INPUT_WIDTH } from 'global-styles';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: '10px 0'
  },
  formControl: {
    width: INPUT_WIDTH
  },
  multiline: {
    width: INPUT_WIDTH + 200
  },
  hidden: {
    display: 'none'
  },
  error: {
    '&:after': {
      backgroundColor: ERROR_COLOR
    }
  }
}));
