import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountIcon from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { IAppState } from 'reducers';
import { styles } from './styles';

interface IMenuComponentProps extends WithStyles<typeof styles> {
  userName?: string;
}

class MenuComponent extends React.Component<IMenuComponentProps, any> {

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
    return (
      <div className={this.props.classes.wrapper}>
        <Typography color="inherit" variant="body1" align="right">
          Hello, {this.props.userName}
        </Typography>
        <IconButton
          aria-label="More"
          aria-owns="Open right Menu"
          aria-haspopup="true"
          onClick={this.handleMenuOpen}
        >
          <AccountIcon className={this.props.classes.icon} />
        </IconButton>

        <Menu
          id="menuRight"
          anchorEl={this.state.dropdownAnchorEl}
          open={this.state.dropdownMenuOpen}
          onClose={this.handleMenuclose}
        >
          <div>
            <MenuItem>My account</MenuItem>
            <MenuItem>Logout</MenuItem>
          </div>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  userName: state.currentUser.details.name,
});

const connectedComponent = connect<any, any, IMenuComponentProps>(mapStateToProps)(MenuComponent);

export const UserMenu = withStyles(styles)(connectedComponent);
