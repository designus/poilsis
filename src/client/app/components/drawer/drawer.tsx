import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import MaterialDrawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { DRAWER_WIDTH, DRAWER_TOP } from '../../global-styles';

const AppDrawer = MaterialDrawer as any;

const styles = theme => ({
  paper: {
    width: DRAWER_WIDTH,
    backgroundColor: '#232323',
    top: DRAWER_TOP,
    zIndex: 1,
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
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

export interface IDrawerProps {
  className: string;
  classes: any;
  mobileDrawerOpen: boolean;
  onClose: () => void;
  children: any;
}

const DrawerContent = ({ classes, onClose, children }) => {
  return (
    <div>
      <Hidden mdUp implementation="css">
        <div className={classes.drawerHeader}>
          <Button
            className={classes.closeButton}
            onClick={onClose}
            variant="text"
            size="small"
            color="secondary"
          >
            <ChevronLeftIcon />
            Close
          </Button>
        </div>
      </Hidden>
      {children}
    </div>
  );
};

const DrawerComponent = (props: IDrawerProps, context) => {
  const { classes, className, mobileDrawerOpen, onClose, children } = props;

  return (
    <div className={className}>
      <Hidden mdUp>
        <AppDrawer
          classes={{
            paper: classes.paperMobile,
          }}
          anchor="left"
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <DrawerContent
            classes={classes}
            children={children}
            onClose={onClose}
          />
        </AppDrawer>
      </Hidden>

      <Hidden smDown implementation="css">
        <AppDrawer
          classes={{
            paper: classes.paper,
          }}
          variant="permanent"
          open
        >
          <DrawerContent
            classes={classes}
            children={children}
            onClose={onClose}
          />
        </AppDrawer>
      </Hidden>
    </div>
  );
};

export const Drawer = withStyles(styles)(DrawerComponent) as any;
