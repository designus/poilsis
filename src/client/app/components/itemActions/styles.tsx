import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    display: 'flex'
  },
  link: {
    display: 'flex',
    width: '36px',
    height: '36px',
    margin: '0 5px',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& svg': {
      color: '#fff'
    }
  },
  edit: {
    background: `${blueGrey[100]}`,
    '&:hover': {
      background: `${indigo[700]}`
    }
  },
  delete: {
    background: `${blueGrey[100]}`,
    '&:hover': {
      background: `${red[600]}`
    }
  }
});
