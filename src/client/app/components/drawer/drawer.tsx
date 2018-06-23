import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import MaterialDrawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { styles } from './styles';

const AppDrawer = MaterialDrawer as any;

export interface IDrawerProps extends WithStyles<typeof styles> {
  mobileDrawerOpen: boolean;
  onClose: () => void;
  children: any;
}

const DrawerContent = ({ classes, onClose, children }) => {
  return (
    <div className={classes.drawerContentWrapper}>
      <div className={classes.drawerContent}>
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
      <div className={classes.bgImage} />
    </div>
  );
};

const DrawerComponent = (props: IDrawerProps, context) => {
  const { classes, mobileDrawerOpen, onClose, children } = props;

  return (
    <div className={classes.drawer}>
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

export const Drawer = withStyles(styles)(DrawerComponent);
