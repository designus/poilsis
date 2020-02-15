import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    paddingTop: '25px'
  },
  row: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    height: '100px'
  },
  item: {
    display: 'flex',
    width: '100%',
    height: '80px',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative'
  },
  image: {
    width: '150px',
    height: 'auto',
    marginRight: '10px',
    '& > img': {
      width: '100%',
      height: 'auto'
    }
  },
  name: {
    color: theme.palette.primary.dark,
    fontSize: '18px'
  }
}));
