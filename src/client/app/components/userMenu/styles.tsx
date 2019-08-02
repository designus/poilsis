import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  icon: {
    width: '34px',
    height: '34px'
  },
  iconRegular: {
    fill: theme.palette.primary.main
  },
  iconInverted: {
    fill: 'rgba(255,255,255,.8)'
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
