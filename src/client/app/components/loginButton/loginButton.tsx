import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { DropdownMenu } from 'components/dropdownMenu';

import { styles } from './styles';

interface ILoginButtonProps extends WithStyles<typeof styles>, InjectedIntlProps {}

const translation = {
  id: 'common.login',
  defaultMessage: 'Login'
};

function LoginButton(props: ILoginButtonProps) {
  const getButton = () => (
    <Fab
      classes={{
        root: props.classes.button
      }}
      color="default"
      variant="extended"
      size="small"
      aria-label={props.intl.formatMessage(translation)}
    >
      <FontAwesomeIcon icon={['far', 'user']} />&nbsp;
      <FormattedMessage {...translation} />
    </Fab>
  );

  return (
    <DropdownMenu
      className={props.classes.dropdownMenu}
      parentItem={getButton()}
      id={`menu-login`}
    >
      <MenuItem>Admin</MenuItem>
      <MenuItem>User</MenuItem>
    </DropdownMenu>
  );
}

export default injectIntl(withStyles(styles)(LoginButton));
