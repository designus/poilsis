import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const green = '#00c133';
const yellow = '#fcc205';
const red = '#ff3030';

const dimensions = {
  width: '100%',
  padding: '10px 20px',
};

export const styles = (theme: Theme) => createStyles({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  success: {
    '& > div': {
      ...dimensions,
      backgroundColor: green,
    },
  },
  warning: {
    '& > div': {
      backgroundColor: yellow,
    },
  },
  message: {
    display: 'flex',
    fontSize: '16px',
    alignItems: 'center',
    '& > svg': {
      paddingRight: '10px',
      fontSize: '30px',
    },
  },
  error: {
    '& > div': {
      backgroundColor: red,
    },
  },
});
