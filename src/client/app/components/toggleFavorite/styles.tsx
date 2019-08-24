import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

export const styles = (theme: Theme) => createStyles({
  button: {
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  icon: {
    color: yellow[500],
    width: '16px',
    height: '16px'
  }
});
