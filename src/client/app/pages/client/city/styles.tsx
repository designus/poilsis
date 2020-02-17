import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    width: '100%',
    height: '100%'
  },
  header: {
    paddingTop: '15px',
    fontSize: '2.6rem'
  }
}));
