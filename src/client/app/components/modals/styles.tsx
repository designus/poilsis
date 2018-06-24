import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const modalStyles = (theme: Theme) => createStyles({
  paper: {
    borderRadius: '0',
    minWidth: '300px',
  },
  actionWrapper: {
    margin: '8px 0 0 0',
  },
  buttonWrapper: {
    width: '50%',
    textAlign: 'center',
    margin: '0',
  },
  dialogContent: {
    paddingTop: '6px',
  },
  close: {
    position: 'absolute',
    top: '0',
    right: '0',
  },
});
