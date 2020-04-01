import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    width: '100%',
    height: 'auto'
  },
  header: {
    paddingTop: 0,
    fontSize: '2.6rem'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  left: {
    width: '240px'
  },
  right: {
    flex: 6
  },
  hidden: {
    display: 'none'
  }
}));
