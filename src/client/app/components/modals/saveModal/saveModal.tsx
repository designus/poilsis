import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface ISaveModalProps extends WithStyles<typeof modalStyles> {
  isModalOpen: boolean;
  onConfirm?: any;
  onCancel?: any;
}

class SaveModalComponent extends React.PureComponent<ISaveModalProps, any> {
  render() {
    const { classes, onConfirm, onCancel, isModalOpen } = this.props;
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
          <DialogContent contentClass={classes.dialogContent}>
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
