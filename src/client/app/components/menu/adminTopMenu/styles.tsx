import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const commonStyles = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: '10px 15px',
  cursor: 'pointer',
  justifyContent: 'space-between'
};

export const styles = (theme: Theme) => createStyles({
  listItem: {
    display: 'inline-block',
    marginRight: '5px',
    width: 'auto',
    background: theme.palette.grey['300'],
    padding: 0
  },
  activeItem: {},
  dropdownItem: {
    ...commonStyles
  },
  dropdownMenu: {
    '& li': {
      display: 'block'
    }
  },
  text: {
    paddingLeft: '0'
  },
  disabled: {
    background: theme.palette.grey['300'],
    ...commonStyles
  },
  link: {
    ...commonStyles,
    color: '#1c1c1c',
    '&:hover, &.active': {
      backgroundColor: theme.palette.primary.dark,
      color: '#fff',
      '& svg, span': {
        color: '#fff'
      }
    }
  },
  icon: {
    marginRight: '5px',
    marginLeft: '5px',
    minWidth: '25px'
  }
});
