import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
  // tslint:disable-next-line
  interface Theme {
    customButton: {
      borderRadius: string
    };
    loadingBar: {
      height: string;
    };
  }
  // allow configuration using `createMuiTheme`
  // tslint:disable-next-line
  interface ThemeOptions {
    customButton: {
      borderRadius: string
    };
    loadingBar: {
      height: string
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
    // secondary: {
    //   main: '#FED00C',
    //   contrastText: '#fff'
    // }
  },
  mixins: {
    toolbar: {
      minHeight: 56,
      '@media (min-width: 600px)': {
        minHeight: 74
      }
    }
  },
  typography: {
    h1: {
      fontSize: '3rem'
    },
    h2: {
      fontSize: '2rem'
    },
    h3: {
      fontSize: '1.5rem'
    },
    h4: {
      fontSize: '1.25rem'
    }
  },
  customButton: {
    borderRadius: '16px'
  },
  loadingBar: {
    height: '4px'
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0
      },
      outlined: {
        borderColor: '#dbdbdb'
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
