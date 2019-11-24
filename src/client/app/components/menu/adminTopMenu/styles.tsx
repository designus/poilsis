import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  list: {
    padding: '0 0 15px 0'
  },
  listItem: {
    display: 'inline-block',
    marginRight: '5px',
    width: 'auto',
    background: theme.palette.grey['200'],
    border: `1px solid ${theme.palette.grey['300']}`,
    padding: 0,
    '& > a, & > span': {
      display: 'flex',
      padding: '10px 25px',
      textDecoration: 'none',
      alignItems: 'center'
    }
  },
  activeItem: {},
  dropdownItem: {},
  dropdownMenu: {
    '& li': {
      display: 'block'
    }
  },
  text: {
    padding: 0,
    margin: 0
  },
  disabled: {
    background: theme.palette.grey['300'],
    pointerEvents: 'none',
    opacity: .5
  },
  link: {
    color: '#1c1c1c',
    '&:hover, &.active': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '& svg, span': {
        color: '#fff'
      }
    }
  },
  icon: {
    marginRight: '5px',
    minWidth: '25px'
  }
});
