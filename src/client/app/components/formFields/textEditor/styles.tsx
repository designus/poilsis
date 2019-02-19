import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  button: {
    cursor: 'pointer',
    color: '#ccc',
    '&.active': {
      color: 'black',
    },
  },
  icon: {
    fontSize: '18px',
    verticalAlign: 'text-bottom',
  },
  hidden: {
    display: 'none',
  },
  toolbar: {
    padding: '10px 10px 5px 10px',
    background: '#f5f6f7',
    borderBottom: '1px solid #dddfe2',
    '& > svg': {
      fill: '#999',
      cursor: 'pointer',
      fontSize: '21px',
      transition: 'all 0.2s linear',
      border: '1px solid #dddfe2',
      width: '25px',
      marginRight: '5px',
      '&:hover': {
        fill: '#000',
        transition: 'all 0.2s linear',
      },
    },
  },
  activeButton: {
    fill: '#000 !important',
  },
  editor: {
    padding: '20px 15px',
    fontFamily: theme.typography.fontFamily,
  },
  wrapper: {
    border: '1px solid #dddfe2',
    background: '#fff',
  },
});
