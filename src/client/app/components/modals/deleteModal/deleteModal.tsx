import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { DIALOG_LOADER_ID } from 'client-utils';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface IDeleteModalProps extends WithStyles<typeof modalStyles> {
  isModalOpen: boolean;
  itemId: string;
  itemName: string;
  onDelete: any;
  onClose: any;
}

class DeleteModalComponent extends React.PureComponent<IDeleteModalProps, any> {

  state = {
    error: null,
  };

  deleteItem = () => {
    this.props.onDelete(this.props.itemId)
      .then(() => this.props.onClose())
      .catch(error => this.setState({ error }));
  }

  render() {
    const { classes, itemName, onClose, isModalOpen } = this.props;
    const { error } = this.state;
    return (
      <div>
        <Dialog
          open={isModalOpen}
          onClose={onClose}
          classes={{
            paper: classes.paper,
          }}
        >
          <DialogHeader
            title={`Delete "${itemName}"`}
            className={classes.close}
            closeModal={onClose}
          />
          <DialogContent
            error={error}
            showLoadingOverlay={true}
            loaderId={DIALOG_LOADER_ID}
            contentClass={classes.dialogContent}
          >
            Delete is permanent, you can not revert this action.
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
