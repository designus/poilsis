import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';
import { Props } from './dropdown';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    minWidth: (props: Props) => props.minWidth || 'initial'
  },
  root: {
    color: 'inherit'
  },
  icon: {
    color: 'inherit'
  }
}));
