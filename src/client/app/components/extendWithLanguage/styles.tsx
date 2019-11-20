import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const languageStyles = (theme: Theme) => createStyles({
  languageOption: {
    display: 'inline-block',
    marginRight: '5px',
    padding: '5px',
    width: '30px',
    textAlign: 'center',
    border: `1px solid ${theme.palette.grey[300]}`,
    cursor: 'pointer',
    borderRadius: '6px',
    background: theme.palette.grey[200]
  },
  typography: {
    textTransform: 'uppercase'
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    borderColor: theme.palette.primary.main,
    '& > span': {
      color: '#fff'
    }
  },
  wrapper: {
    padding: '10px 0'
  }
});
