import {DRAWER_TOP, DRAWER_WIDTH} from 'global-styles';

export const styles = theme => ({
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
  root: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '100%',
    width: '100%',
  },
  appBarTitle: {
    flex: 1,
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  drawer: {
    top: DRAWER_TOP,
    [theme.breakpoints.up('lg')]: {
      width: DRAWER_WIDTH,
    },
  },
  content: {
    width: '100%',
    padding: theme.spacing.unit,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - ' + DRAWER_WIDTH + 'px)',
    },
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
      padding: theme.spacing.unit * 3,
    },
  },
}) as any;
