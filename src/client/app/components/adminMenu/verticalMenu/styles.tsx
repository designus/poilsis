import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  button: {
    padding: '3px 10px',
    '&.disabled': {
      pointerEvents: 'none',
      opacity: .5,
    },
    '& > a': {
      display: 'flex',
      width: '100%',
      padding: '12px 10px',
      borderRadius: '2px',
      fontWeight: 300,
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  link: {},
});
