import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { FormattedMessage } from 'react-intl';

import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { Header, Content, Footer } from 'components/modals/shared';
import { SimpleTabs, TabOption } from 'components/tabs';
import { useStyles } from './styles';

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
};

export default function AuthenticationModal(props: Props) {
  const { onClose, isModalOpen } = props;
  const classes = useStyles(props);

  const tabOptions: TabOption[] = [
    {
      label: 'Login',
      content: 'Login form'
    },
    {
      label: 'Register',
      content: 'Registration form'
    }
  ];

  return (
    <Dialog
      open={isModalOpen}
      onClose={onClose}
      classes={{ paper: classes.wrapper }}
    >
      <Header onClose={onClose}>
        Sign in
      </Header>
      <Content
        showLoadingOverlay={true}
        loaderId={DIALOG_LOADER_ID}
      >
        <SimpleTabs options={tabOptions} />
      </Content>
    </Dialog>
  );
}
