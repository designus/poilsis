import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import { languageStyles } from 'components';

export const styles = (theme: Theme) => createStyles({
  root: {
    padding: '15px 0',
  },
  metaContent: {
    padding: '20px 15px',
    background: '#fff',
    border: '1px solid #dddfe2',
  },
});
