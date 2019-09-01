import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      boxSizing: 'border-box',
      height: '100%'
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit'
    },
    ':focus': {
      outline: 'none'
    },
    body: {
      height: '100%',
      margin: 0
    },
    'div[id=app]': {
      height: '100%'
    }
  },
  appBarTitle: {
    flex: 1
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: '0px -3px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.008)'
  },
  wrapper: {
    margin: '0 auto',
    width: '100%',
    height: '100%'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  topMenu: {
    display: 'flex',
    flex: 3
  },
  logo: {
    flex: 1,
    padding: '10px 0',
    cursor: 'pointer',
    '& > img': {
      height: '50px',
      width: 'auto'
    }
  }
});
