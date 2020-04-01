import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';
import { Props } from './languageSelector';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: (props: Props) => ({
    padding: '0 0 0 15px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
    '& svg, & div': {
      color: props.isAdmin ? '#fff' : '#1c1c1c'
    }
  })
}));
