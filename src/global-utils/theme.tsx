import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
  // tslint:disable-next-line
  interface Theme {
    customButton?: {
      borderRadius: string
    };
  }
  // allow configuration using `createMuiTheme`
  // tslint:disable-next-line
  interface ThemeOptions {
    customButton?: {
      borderRadius: string
    };
  }
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#609BFA',
      main: '#285ABE',
      dark: '#204283',
      contrastText: '#fff'
    }
  },
  customButton: {
    borderRadius: '10px'
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0
      }
    },
    MuiSnackbar: {
      root: {
        width: '100%'
      }
    },
    MuiInput: {
      underline: {
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottomWidth: '1px'
        }
      }
    },
    MuiSnackbarContent: {
      root: {
        borderRadius: '0!important',
        boxShadow: 'none',
        width: '100%',
        padding: '10px 20px'
      }
    }
  }
});
