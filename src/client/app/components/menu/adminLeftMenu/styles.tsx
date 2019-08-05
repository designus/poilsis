import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

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
  activeItem: {},
  dropdownItem: {},
  dropdownMenu: {},
  text: {
    paddingLeft: '5px',
    '& > span': {
      color: '#fff'
    }
  },
  icon: {
    marginRight: '5px',
    marginLeft: '5px',
    minWidth: '25px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  disabled: {
    pointerEvents: 'none',
    opacity: .5
  },
  collapsableMenu: {
    paddingLeft: '20px'
  },
  collapsableItem: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '2px',
    cursor: 'pointer',
    padding: '12px 10px',
    width: '100%',

    '&:hover, &.active': {
      backgroundColor: '#00acc1'
    }
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 10px',
    borderRadius: '2px',
    fontWeight: 300,
    textDecoration: 'none',

    '&:hover, &.active': {
      backgroundColor: '#00acc1'
    }
  }
});
