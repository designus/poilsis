import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  list: {
    background: '#fff',
    marginRight: '25px',
    marginTop: 0,
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: 0,
    borderRadius: 8,
    overflow: 'hidden'
  },
  listItem: {
    padding: 0,
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`
    }
  },
  activeItem: {},
  text: {
    paddingLeft: '25px'
  },
  icon: {},
  collapsableMenu: {},
  collapsableItem: {},
  link: {
    display: 'block',
    width: '100%',
    padding: '12px 0',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&.active, &:hover': {
      background: theme.palette.primary.main,
      color: '#fff'
    }
  }
});
