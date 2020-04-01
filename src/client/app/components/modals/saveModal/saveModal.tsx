import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { FormattedMessage } from 'react-intl';

import { styles } from '../styles';
import { Header, Content, Footer } from '../shared';

export interface ISaveModalProps extends WithStyles<typeof styles> {
  isModalOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

class SaveModalComponent extends React.PureComponent<ISaveModalProps, any> {
  render() {
    const { classes, onConfirm, onCancel, isModalOpen } = this.props;
    return (
      <Dialog
        open={isModalOpen}
        onClose={onCancel}
        classes={{
          paper: classes.paper,
          root: classes.root
        }}
      >
        <Header onClose={onCancel}>
          <FormattedMessage id="admin.save_modal.title" />
        </Header>
        <Content>
          <FormattedMessage id="admin.save_modal.description" />
        </Content>
        <Footer
          onClose={onCancel}
          onSubmit={onConfirm}
          submitLabelId="common.proceed"
        />
      </Dialog>
    );
  }
}

export const SaveModal = withStyles(styles)(SaveModalComponent);
