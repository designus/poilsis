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
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  main: {
    padding: '25px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '85px',
    },
  },
  appBar: {
    zIndex: 0,
    position: 'relative',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      zIndex: 1,
    },
  },
  content: {
    minWidth: `calc(100% - ${DRAWER_WIDTH}px)`,
    width: '100%',
  },
});
