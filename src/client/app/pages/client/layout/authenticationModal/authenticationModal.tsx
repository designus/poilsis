import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useIntl, defineMessages } from 'react-intl';

import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { Header, Content } from 'components/modals/shared';
import { SimpleTabs, TabOption } from 'components/tabs';
import { useStyles } from './styles';

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
};

const messages = defineMessages({
  sign_in: {
    id: 'client.sign_in',
    defaultMessage: 'Sign in'
  },
  sign_up: {
    id: 'client.sign_up',
    defaultMessage: 'Sign up'
  }
});

export default function AuthenticationModal(props: Props) {
  const { onClose, isModalOpen } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState(0);

  const tabOptions: TabOption[] = [
    {
      label: intl.formatMessage(messages.sign_in),
      content: 'Login form'
    },
    {
      label: intl.formatMessage(messages.sign_up),
      content: 'Registration form'
    }
  ];

  const handleTabChange = (value: number) => setActiveTab(value);

  return (
    <Dialog
      open={isModalOpen}
      onClose={onClose}
      classes={{ paper: classes.wrapper }}
    >
      <Header onClose={onClose}>
        {intl.formatMessage(activeTab === 0 ? messages.sign_in : messages.sign_up)}
      </Header>
      <Content
        showLoadingOverlay={true}
        loaderId={DIALOG_LOADER_ID}
      >
        <SimpleTabs
          options={tabOptions}
          onChange={handleTabChange}
        />
      </Content>
    </Dialog>
  );
}
