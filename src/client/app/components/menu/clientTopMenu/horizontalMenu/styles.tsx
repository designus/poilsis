import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const commonStyles = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: '2px 15px',
  cursor: 'pointer',
  justifyContent: 'space-between',
  color: '#1c1c1c'
};

export const styles = (theme: Theme) => createStyles({
  listItem: {
    display: 'inline-block',
    marginRight: '5px',
    width: 'auto',
    padding: 0
  },
  activeItem: {
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    '& > a, & > div': {
      color: 'inherit!important'
    }
  },
  dropdownItem: {
    ...commonStyles,
    '&:hover, &.active': {
      backgroundColor: theme.palette.primary.dark,
      color: '#fff'
    }
  },
  dropdownMenu: {
    marginTop: '36px',
    borderRadius: 0,
    '& ul': {
      padding: 0
    },
    '& li': {
      display: 'block',
      margin: 0,
      padding: 0,
      minWidth: '160px',

      '& > div:hover, & > div.active, & a:hover, & a.active': {
        background: '#ededed',
        color: '#1c1c1c',
        textDecoration: 'underline'
      }
    }
  },
  text: {
    paddingLeft: '0'
  },
  disabled: {},
  link: {
    ...commonStyles,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: '#fff'
    }
  },
  icon: {}
});
