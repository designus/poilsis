import * as React from 'react';

import withStyles from 'material-ui/styles/withStyles';
import MaterialDrawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';

import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';

import {DRAWER_WIDTH, DRAWER_TOP} from '../../global-styles';

const AppDrawer = MaterialDrawer as any;

const styles = theme => ({
  paper: {
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.background.paper,
    top: DRAWER_TOP,
    zIndex: 1,
  },
  paperMobile: {
    top: 0,
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
  anchor: {
    color: theme.palette.text.secondary,
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
  onRequestClose: () => void;
  children: any;
}

function DrawerComponent(props: IDrawerProps, context) {
  const { classes, className, mobileDrawerOpen, onRequestClose, children } = props;

  const drawer = (
    <div>
      <Hidden lgUp implementation="css">
      <div className={classes.drawerHeader}>
        <IconButton onClick={onRequestClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      </Hidden>
      {children}
    </div>
  );

  return (
    <div className={className}>
      <Hidden lgUp>
        <AppDrawer
          classes={{
            paper: classes.paperMobile,
          }}
          type="temporary"
          open={mobileDrawerOpen}
          onRequestClose={onRequestClose}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </AppDrawer>
      </Hidden>

      <Hidden lgDown implementation="css">
        <AppDrawer
          classes={{
            paper: classes.paper,
          }}
          type="permanent"
          open
        >
          {drawer}
        </AppDrawer>
      </Hidden>
    </div>
  );
}

export const Drawer = withStyles(styles)(DrawerComponent) as any;
