import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  flexContainer: {
    display: 'flex',
    borderRadius: '30px',
    padding: '5px 10px',
    justifyContent: 'space-between',
    '& > a': {
      height: '30px'
    }
  },
  button: {
    width: '30px',
    height: '30px',
    minHeight: '30px',
    boxShadow: 'none',
    margin: '0 5px',
    backgroundColor: indigo[500],
    '&:hover': {
      backgroundColor: indigo[700]
    },
    '&:active': {
      boxShadow: 'none'
    }
  },
  icon: {
    color: '#fff'
  }
});
