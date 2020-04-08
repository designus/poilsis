import React, { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fab from '@material-ui/core/Fab';
import { FormattedMessage, useIntl } from 'react-intl';

import { isLoggedIn as isAuthenticated } from 'selectors';
import { AuthenticationModal } from '../authenticationModal';
import { useStyles } from './styles';

const translation = {
  id: 'common.login',
  defaultMessage: 'Login'
};

function LoginButton(props: {}) {
  const classes = useStyles();
  const isLoggedIn = useSelector(isAuthenticated);
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = (isOpen: boolean) => () => setModalOpen(isOpen);

  return !isLoggedIn ? (
    <React.Fragment>
      <Fab
        classes={{ root: classes.button }}
        color="default"
        variant="extended"
        size="small"
        aria-label={intl.formatMessage(translation)}
        onClick={toggleModal(true)}
      >
        <FontAwesomeIcon icon={['far', 'user']} />&nbsp;
        <FormattedMessage {...translation} />
      </Fab>
      <AuthenticationModal isModalOpen={modalOpen} onClose={toggleModal(false)} />
    </React.Fragment>
  ) : null;
}

export default memo(LoginButton);
