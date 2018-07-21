import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  checkbox: {
    height: '36px',
    width: '36px',
  },
  formControlLabel: {
    marginLeft: '-9px',
    width: '100%',
  },
  wrapper: {
    padding: '20px 0',
  },
  default: {
    height: '30px',
  },
  label: {
    paddingBottom: '15px',
    fontSize: '16px',
  },
});
