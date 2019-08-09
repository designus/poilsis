import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => {
  const { borderRadius } = theme.customButton;
  return createStyles({
    button: {
      boxShadow: 'none',
      backgroundColor: theme.palette.grey[300],
      padding: '0 12px !important',
      '&.active': {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }
    },
    dropdownMenu: {
      top: '59px !important',
      padding: 0,
      minWidth: '150px',
      borderRadius: `0px ${borderRadius} ${borderRadius} ${borderRadius}`,
      '& ul': {
        padding: 0
      },
      '& li': {
        minHeight: 'auto'
      }
    }
  });
};
