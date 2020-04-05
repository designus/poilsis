import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`
  }
}));
