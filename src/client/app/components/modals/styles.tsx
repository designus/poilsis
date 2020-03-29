import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  root: {
    zIndex: '2000!important' as any
  },
  paper: {
    borderRadius: '0',
    width: '600px'
  },
  closeButton: {
    color: '#fff'
  },
  content: {
    paddingTop: '20px',
    paddingBottom: '10px'
  },
  header: {
    background: theme.palette.primary.main,
    paddingTop: '8px',
    paddingBottom: '8px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
