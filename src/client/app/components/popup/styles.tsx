import { makeStyles, Theme } from '@material-ui/core/styles';
import { Props } from './popup';

export const useStyles = makeStyles((theme: Theme) => ({
  typography: {
    padding: theme.spacing(2)
  },
  wrapper: {
    marginLeft: '15px',
    maxWidth: (props: Props) => props.maxWidth || 'initial'
  },
  mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    cursor: 'pointer'
  },
  icon: {
    color: '#000'
  }
}));
