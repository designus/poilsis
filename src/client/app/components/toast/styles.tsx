import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

export const styles = (theme: Theme) => createStyles({
  success: {
    '& > div': {
      width: '100%',
      padding: '10px 20px',
      backgroundColor: green[500]
    }
  },
  warning: {
    '& > div': {
      backgroundColor: yellow[500]
    }
  },
  message: {
    display: 'flex',
    fontSize: '16px',
    alignItems: 'center',
    '& > svg': {
      paddingRight: '10px',
      fontSize: '30px'
    }
  },
  error: {
    '& > div': {
      backgroundColor: red[500]
    }
  }
});
