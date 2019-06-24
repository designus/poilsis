import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import { DIVIDER_COLOR } from '../../global-styles';

export const styles = (theme: Theme) => createStyles({
  searchWrapper: {
    margin: '0 30px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, .3)'
  },
  root: {
    width: '120px',
    transition: 'all .2s linear',
    borderBottom: `1px solid ${DIVIDER_COLOR}`
  },
  focused: {
    width: '170px',
    transition: 'all .2s linear'
  },
  input: {
    padding: '7px',
    margin: '0 15px 0 0',
    color: indigo[500],
    '&::placeholder': {
      color: '#777777'
    }
  },
  icon: {
    fill: indigo[500]
  }
});
