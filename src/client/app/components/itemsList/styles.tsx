import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles } from '@material-ui/core/styles';
import { SMALL_IMAGE_WIDTH, SMALL_IMAGE_HEIGHT } from 'global-utils/constants';
import { rowHeight } from './itemsList';

export const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    paddingTop: '25px'
  },
  row: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    height: `${rowHeight}px`
  },
  item: {
    display: 'flex',
    width: '100%',
    height: `${SMALL_IMAGE_HEIGHT}px`,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative'
  },
  image: {
    width: `${SMALL_IMAGE_WIDTH}px`,
    height: 'auto',
    marginRight: '10px',
    display: 'flex',
    justifyContent: 'center',
    background: '#fff',
    '& > img': {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  },
  content: {
    alignSelf: 'start'
  },
  name: {
    color: theme.palette.primary.dark
  }
}));
