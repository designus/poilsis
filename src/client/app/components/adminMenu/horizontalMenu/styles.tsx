import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const commonStyles = {
  textDecoration: 'none',
  display: 'flex',
  padding: '10px 15px',
  justifyContent: 'space-between',
};

export const styles = (theme: Theme) => createStyles({
  button: {
    display: 'inline-block',
    marginRight: '5px',
    width: 'auto',
  },
  text: {
    paddingLeft: '0',
  },
  span: {
    background: theme.palette.grey['300'],
    ...commonStyles,
  },
  link: {
    background: theme.palette.grey['300'],
    ...commonStyles,
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
