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
      height: '100%',
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
    'div[id=app]': {
      height: '100%',
    },
  },
  appBarTitle: {
    flex: 1,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
  },
  main: {
    padding: '25px',
    position: 'relative',
    flex: 3,
    overflowX: 'auto',
    '& > .loader': {
      position: 'relative',
    },
  },
  appBar: {
    zIndex: 2,
    position: 'relative',
    display: 'block',
  },
  content: {
    minWidth: `calc(100% - ${DRAWER_WIDTH}px)`,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});
