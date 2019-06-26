import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { FormattedMessage } from 'react-intl';

import { DIALOG_LOADER_ID } from 'client-utils';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface IDeleteModalProps extends Partial<WithStyles<typeof modalStyles>> {
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
      <div>
        <Dialog
          open={isModalOpen}
          onClose={onClose}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogHeader
            className={classes.close}
            closeModal={onClose}
          >
            <FormattedMessage id="admin.delete_modal.title" values={{ item: itemName }}/>
          </DialogHeader>
          <DialogContent
            showLoadingOverlay={true}
            loaderId={DIALOG_LOADER_ID}
            contentClass={classes.dialogContent}
          >
            <FormattedMessage id="admin.delete_modal.description" />
          </DialogContent>
          <DialogFooter
            classes={classes}
            onClose={onClose}
            onSubmit={this.deleteItem}
          />
        </Dialog>
      </div>
    );
  }
}

export const DeleteModal = withStyles(modalStyles)(DeleteModalComponent);
