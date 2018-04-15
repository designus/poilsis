import { blue, blueGrey, grey } from 'material-ui/colors';

export const modalStyles = theme => ({
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
  button: {
    width: '100%',
    borderRadius: '0',
  },
  submit: {
    background: blue[800],
    color: '#fff',
    '&:hover': {
      background: blue[900],
    },
  },
  dialogContent: {
    paddingTop: '6px!important',
  },
  cancel: {
    background: grey[100],
    '&:hover': {
      background: blueGrey[100],
    },
  },
  close: {
    position: 'absolute' as 'absolute',
    top: '0',
    right: '0',
  },
});
