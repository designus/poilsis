import { DRAWER_WIDTH } from '../../../global-styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    ':focus': {
      outline: 'none',
    },
    body: {
      height: '100%',
      margin: 0,
    },
    'div[id=root]': {
      height: '100%',
    },
  },
  appBarTitle: {
    flex: 1,
  },
  main: {
    paddingTop: '56px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    padding: '25px',
    height: 'calc(100% - 56px)',
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - ' + DRAWER_WIDTH + 'px)',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});
