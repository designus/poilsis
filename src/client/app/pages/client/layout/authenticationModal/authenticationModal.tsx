import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { FormattedMessage } from 'react-intl';

import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { Header, Content, Footer } from 'components/modals/shared';
import { useStyles } from './styles';

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
};

export default function AuthenticationModal(props: Props) {
  const { onClose, isModalOpen } = props;
  const classes = useStyles(props);

  const handleSubmit = () => ({});

  return (
    <Dialog
      open={isModalOpen}
      onClose={onClose}
    >
      <Header onClose={onClose}>
        Sign in
      </Header>
      <Content
        showLoadingOverlay={true}
        loaderId={DIALOG_LOADER_ID}
      >
        {/* <FormattedMessage id="admin.delete_modal.description" /> */}
      </Content>
      <Footer
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
}
