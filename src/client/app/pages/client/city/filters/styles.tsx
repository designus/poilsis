import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    background: '#fff',
    margin: '30px 0',
    padding: '15px',
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: 8,
    position: 'sticky',
    top: 0
  }
}));
