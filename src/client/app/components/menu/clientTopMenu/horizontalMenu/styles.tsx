import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

const getListItemContentStyle = (theme: Theme) => ({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: '2px 15px',
  cursor: 'pointer',
  justifyContent: 'space-between',
  color: theme.palette.text.primary
});

const getActiveStateStyle = (theme: Theme) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  borderRadius: theme.customButton.borderRadius
});

export const styles = (theme: Theme) => {
  const { borderRadius } = theme.customButton;
  return createStyles({
    listItem: {
      display: 'inline-block',
      marginRight: '5px',
      width: 'auto',
      padding: 0,
      borderRadius
    },
    activeItem: {
      ...getActiveStateStyle(theme),
      '& > a, & > div': {
        color: 'inherit!important'
      }
    },
    dropdownItem: {
      ...getListItemContentStyle(theme),
      '&:hover, &.active': getActiveStateStyle(theme),
      '&.active': {
        borderRadius: `${borderRadius} ${borderRadius} 0 0`
      }
    },
    dropdownMenu: {
      marginTop: '36px',
      borderRadius: `0 ${borderRadius} ${borderRadius} ${borderRadius}`,
      '& ul': {
        padding: 0
      },
      '& li': {
        display: 'block',
        margin: 0,
        padding: 0,
        minWidth: '200px',
        '& > div:hover, & > div.active, & a:hover, & a.active': {
          background: '#ededed',
          color: theme.palette.text.primary,
          borderRadius: 0
        }
      }
    },
    text: {
      paddingLeft: 0
    },
    link: {
      ...getListItemContentStyle(theme),
      '&:hover': getActiveStateStyle(theme)
    }
  });
};
