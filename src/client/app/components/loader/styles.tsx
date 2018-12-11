import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  centeredLoader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
    background: 'rgb(250, 250, 250)',
  },
  round: {
    padding: '7px',
    borderRadius: '999px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 7px #ccc',
  },
  hidden: {
    display: 'none',
  },
  overlay: {
    background: 'rgba(250, 250, 250, .6)',
    zIndex: 100,
  },
});
