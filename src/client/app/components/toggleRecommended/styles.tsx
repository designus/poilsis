import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    cursor: 'pointer'
  },
  icon: {
    color: yellow[600],
    width: '30px',
    height: '30px'
  }
});
