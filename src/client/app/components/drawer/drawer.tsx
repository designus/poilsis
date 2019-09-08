import * as React from 'react';

import { withStyles, WithStyles } from '@material-ui/core/styles';
import MaterialDrawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';

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
          <div className={classes.drawerHeader}>
            <Typography variant="h6">
              Menu
            </Typography>
            <Hidden mdUp implementation="css">
              <Button
                onClick={onClose}
                className={classes.closeButton}
                variant="text"
                size="small"
              >
                <ChevronLeftIcon />
                <Typography className={classes.closeButtonText} variant="body1">
                  Close
                </Typography>
              </Button>
            </Hidden>
          </div>
        {children}
      </div>
      <div className={classes.bgImage} />
    </div>
  );
};

const Drawer = (props: IDrawerProps) => {
  const { classes, mobileDrawerOpen, onClose, children } = props;

  return (
    <div className={classes.drawer}>
      <Hidden smUp implementation="css">
        <AppDrawer
          classes={{
            paper: classes.paperMobile,
            docked: classes.docked,
            paperAnchorDockedLeft: classes.paperAnchorDockedLeft
          }}
          anchor="left"
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true
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
            docked: classes.docked,
            paperAnchorDockedLeft: classes.paperAnchorDockedLeft
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

export default withStyles(styles)(Drawer);
