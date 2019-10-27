import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  isEnabledWrapper: {
    display: 'flex',
    justifyContent: 'space-between',

    '& > a': {
      margin: '0 5px'
    }
  }
});
