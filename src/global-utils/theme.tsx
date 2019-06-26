import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
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
