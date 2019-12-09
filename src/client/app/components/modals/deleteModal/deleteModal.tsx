import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { FormattedMessage } from 'react-intl';

import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { styles } from '../styles';
import { Header, Content, Footer } from '../shared';

export interface IDeleteModalProps extends Partial<WithStyles<typeof styles>> {
  isModalOpen: boolean;
  itemId: string;
  itemName: string;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

class DeleteModalComponent extends React.PureComponent<IDeleteModalProps, any> {

  deleteItem = () => {
    this.props.onDelete(this.props.itemId).then(() => this.props.onClose());
  }

  render() {
    const { classes, itemName, onClose, isModalOpen } = this.props;
    return (
      <Dialog
        open={isModalOpen}
        onClose={onClose}
        classes={{
          paper: classes.paper
        }}
      >
        <Header onClose={onClose}>
          <FormattedMessage id="admin.delete_modal.title" values={{ item: itemName }}/>
        </Header>
        <Content
          showLoadingOverlay={true}
          loaderId={DIALOG_LOADER_ID}
        >
          <FormattedMessage id="admin.delete_modal.description" />
        </Content>
        <Footer
          onClose={onClose}
          onSubmit={this.deleteItem}
        />
      </Dialog>
    );
  }
}

export const DeleteModal = withStyles(styles)(DeleteModalComponent);
