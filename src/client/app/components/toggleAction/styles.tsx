import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  button: {
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  icon: {
    color: '#fff',
    width: '18px',
    height: '18px',
  },
  green: {
    background: 'green',
  },
  red: {
    background: 'red',
  },
});
