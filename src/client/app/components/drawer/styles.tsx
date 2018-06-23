
import { DRAWER_WIDTH, DRAWER_TOP } from '../../global-styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  drawer: {
    top: DRAWER_TOP,
    [theme.breakpoints.up('lg')]: {
      width: DRAWER_WIDTH,
    },
  },
  bgImage: {
    background: 'url(http://localhost:3000/images/sidebar-1.jpg) no-repeat top left',
    backgroundSize: 'cover',
    height: '100%',
    top: '0',
    left: '0',
    width: '100%',
    position: 'absolute',
    zIndex: 1,

    '&:after': {
      width: '100%',
      height: '100%',
      content: '""',
      zIndex: 3,
      position: 'absolute',
      opacity: .8,
      background: '#000',
    },
  },
  paper: {
    width: DRAWER_WIDTH,
    top: DRAWER_TOP,
    zIndex: 1,
  },
  docked: {
    width: DRAWER_WIDTH,
  },
  paperMobile: {
    top: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#232323',
    zIndex: 1,
  },
  anchor: {
    color: theme.palette.text.secondary,
  },
  closeButton: {
    color: '#fff',
    textTransform: 'initial',
  },
  closeButtonText: {
    color: '#fff',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    borderBottom: '1px dashed rgba(255, 255, 255, .6)',
    ...theme.mixins.toolbar,
  },
  drawerContentWrapper: {
    height: '100%',
  },
  drawerContent: {
    zIndex: 4,
    position: 'relative',
  },
});
