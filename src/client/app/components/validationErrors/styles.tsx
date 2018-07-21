import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import { ERROR_COLOR } from '../../global-styles';

export const styles = (theme: Theme) => createStyles({
  wrapper: {
    color: ERROR_COLOR,
    padding: '10px 0',
    fontStyle: 'italic',
  },
});
