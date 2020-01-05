import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    background: '#fff',
    height: theme.loadingBar.height
  },
  admin: {
    background: theme.palette.primary.main
  }
});
