import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const useStyles = makeStyles((theme: Theme) => ({
  price: {
    display: 'flex',
    color: red[500]
  }
}));
