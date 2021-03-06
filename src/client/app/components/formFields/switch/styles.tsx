import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    padding: '10px 0'
  },
  hidden: {
    display: 'none'
  }
});
