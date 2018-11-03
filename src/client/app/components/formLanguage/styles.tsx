import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  languageOption: {
    display: 'inline-block',
    marginRight: '5px',
    padding: '5px',
    width: '30px',
    textAlign: 'center',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  typography: {
    textTransform: 'capitalize',
  },
  active: {
    backgroundColor: '#3f51b5',
    color: '#fff',
    borderColor: '#3f51b5',
    '& > span': {
      color: '#fff',
    },
  },
  languagePicker: {
    padding: '10px 0',
  },
});
