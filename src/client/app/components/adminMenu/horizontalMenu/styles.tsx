import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  button: {
    display: 'inline-block',
    marginRight: '5px',
    width: 'auto',
  },
  text: {
    paddingLeft: '0',
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    padding: '10px 15px',
    background: theme.palette.grey['300'],
    justifyContent: 'space-between',
    '&:hover, &.active': {
      backgroundColor: theme.palette.primary.dark,
      color: '#fff',
      '& svg, span': {
        color: '#fff',
      },
    },
  },
  icon: {
  },
});
