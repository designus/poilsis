import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import AccountIcon from 'material-ui-icons/AccountCircle';
import { MenuItem } from 'material-ui/Menu';
import Menu from 'material-ui/Menu';

const styles = theme => ({
  icon: {
    fill: 'rgba(255,255,255,.8)',
    width: '34px',
    height: '34px',
  },
});

class MenuComponent extends React.Component<any, any> {

  state = {
    dropdownAnchorEl: null,
    dropdownMenuOpen: false,
  };

  handleMenuOpen = event => {
    this.setState({ dropdownMenuOpen: true, dropdownAnchorEl: event.currentTarget });
  }

  handleMenuclose = () => {
    this.setState({ dropdownMenuOpen: false });
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns="Open right Menu"
          aria-haspopup="true"
          onClick={this.handleMenuOpen}
          className={classes.menuButtonRight}
        >
          <AccountIcon className={classes.icon} />
        </IconButton>

        <Menu
          id="menuRight"
          anchorEl={this.state.dropdownAnchorEl}
          open={this.state.dropdownMenuOpen}
          onRequestClose={this.handleMenuclose}
        >
          <div>
            <MenuItem>My account</MenuItem>
            <MenuItem>Logout</MenuItem>
          </div>
        </Menu>
      </div>
    );
  }
};

export const UserMenu = withStyles(styles)(MenuComponent) as any;
