import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    padding: '0 0 0 15px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
    '& > div': {
      color: '#fff'
    }
  }
});
