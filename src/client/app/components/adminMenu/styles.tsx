import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  button: {
    padding: '3px 5px',
    '&.disabled': {
      pointerEvents: 'none',
      opacity: .5,
    },
    '& $icon': {
      color: '#fff',
    },
    '& > a': {
      display: 'flex',
      width: '100%',
      padding: '10px 5px',
      borderRadius: '4px',
      textDecoration: 'none',
    },
    '& > a:hover, & > a.active': {
      backgroundColor: '#00acc1',
    },
  },
  text: {
    paddingLeft: '5px',
    '& > span': {
      color: '#fff',
    },
  },
  icon: {
    marginRight: '5px',
  },
});
