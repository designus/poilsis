import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

export const styles = (theme: Theme) => createStyles({
  button: {
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '11px'
  },
  icon: {
    color: '#fff',
    width: '16px',
    height: '16px'
  },
  green: {
    background: green[500]
  },
  red: {
    background: red[500]
  },
  disabled: {
    background: '#ccc'
  },
  tooltip: {
    maxWidth: '200px'
  }
});
