import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { DIALOG_LOADER_ID } from 'client-utils';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface ISaveModalProps extends WithStyles<typeof modalStyles> {
  isModalOpen: boolean;
  onCloseModal?: any;
  onConfirm?: any;
  onCancel?: any;
}

class SaveModalComponent extends React.PureComponent<ISaveModalProps, any> {

  state = {
    error: null,
  };

  openModal() {
    this.setState({isModalOpen: true});
  }

  render() {
    const { classes, onConfirm, onCancel, isModalOpen } = this.props;
    const { error } = this.state;
    return (
      <div>
        <Dialog
          open={isModalOpen}
          onClose={onCancel}
          classes={{
            paper: classes.paper,
          }}
        >
          <DialogHeader
            title="Proceed without saving?"
            className={classes.close}
            closeModal={onCancel}
          />
          <DialogContent
            error={error}
            loaderId={DIALOG_LOADER_ID}
            showLoadingOverlay={true}
            contentClass={classes.dialogContent}
          >
            You made some changes to the form. Do you want to proceed without saving?
          </DialogContent>
          <DialogFooter
            classes={classes}
            onClose={onCancel}
            onSubmit={onConfirm}
            closeLabel="Cancel"
            submitLabel="Proceed"
          />
        </Dialog>
      </div>
    );
  }
}

export const SaveModal = withStyles(modalStyles)(SaveModalComponent);
