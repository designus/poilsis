import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const getListItemContentStyle = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '14px 10px',
  color: '#fff',
  textDecoration: 'none',
  width: '100%',
  '&:hover, &.active': {
    backgroundColor: theme.palette.primary.main
  }
});

export const styles = (theme: Theme) => createStyles({
  list: {
    width: '100%'
  },
  listItem: {
    padding: '3px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  activeItem: {
    '& > a, & > div:first-child': {
      backgroundColor: theme.palette.primary.main
    }
  },
  text: {
    padding: '0 0 0 5px'
  },
  icon: {
    marginRight: '5px',
    marginLeft: '5px',
    minWidth: '25px',
    height: '22px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  collapsableMenu: {
    paddingLeft: '5px',
    '& li a, & li > div': {
      padding: '3px 10px',
      cursor: 'pointer'
    }
  },
  collapsableItem: getListItemContentStyle(theme),
  link: getListItemContentStyle(theme)
});
