import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  topMenu: {
    display: 'flex',
    flex: 3
  },
  listItem: {
    minHeight: 'auto',
    padding: 0,
    margin: '0 5px',
    '&:hover a': {
      color: 'inherit'
    },
    '&:hover': {
      background: theme.palette.primary.dark,
      color: '#fff'
    }
  },
  link: {
    color: '#1B2946',
    textDecoration: 'none',
    padding: '5px 10px'
  },
  active: {
    background: theme.palette.primary.dark,
    color: '#fff',
    '& a': {
      color: '#fff'
    }
  }
});
