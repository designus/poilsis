import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    borderRadius: 0,
    '& ul': {
      padding: 0
    }
  }
});
