import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import { DIALOG_LOADER_ID } from '../../../client-utils';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface IDeleteModalProps {
  isModalOpen: boolean;
  itemId: string;
  itemName: string;
  onDelete: any;
  onCloseModal?: any;
}

class DeleteModalComponent extends React.PureComponent<IDeleteModalProps & { classes: any }, any> {

  state = {
    error: null,
  };

  deleteItem = () => {
    this.props.onDelete(this.props.itemId)
      .then(() => this.props.onCloseModal())
      .catch(error => this.setState({error}));
  }

  openModal(id) {
    this.setState({isModalOpen: true, deleteId: id});
  }

  render() {
    const {classes, itemName} = this.props;
    const {error} = this.state;

    return (
      <div>
        <Dialog
          open={this.props.isModalOpen}
          onClose={this.props.onCloseModal}
          classes={{
            paper: classes.paper,
          }}
        >
          <DialogHeader
            title={`Delete "${itemName}"`}
            className={classes.close}
            closeModal={this.props.onCloseModal}
          />
          <DialogContent
            error={error}
            loaderId={DIALOG_LOADER_ID}
            showLoadingOverlay={true}
            contentClass={classes.dialogContent}
          >
            Delete is permanent, you can not revert this action.
          </DialogContent>
          <DialogFooter
            classes={classes}
            onClose={this.props.onCloseModal}
            onSubmit={this.deleteItem}
          />
        </Dialog>
      </div>
    );
  }
}

export const DeleteModal = withStyles(modalStyles)<IDeleteModalProps>(DeleteModalComponent);
