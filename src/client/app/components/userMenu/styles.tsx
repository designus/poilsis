import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  icon: {
    fill: 'rgba(255,255,255,.8)',
    width: '34px',
    height: '34px'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sessionTimer: {
    paddingRight: '10px'
  }
});
