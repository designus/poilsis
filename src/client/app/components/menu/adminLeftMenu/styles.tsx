import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const getListItemContentStyle = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '8px 10px',
  width: '100%',
  '&:hover, &.active': {
    backgroundColor: theme.palette.primary.main
  }
});

export const styles = (theme: Theme) => {
  return createStyles({
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
};
