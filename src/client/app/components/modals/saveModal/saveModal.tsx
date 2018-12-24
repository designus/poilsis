import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { FormattedMessage } from 'react-intl';

import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface ISaveModalProps extends WithStyles<typeof modalStyles> {
  isModalOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
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
        }}
      >
        <DialogHeader
          className={classes.close}
          closeModal={onCancel}
        >
          <FormattedMessage id="admin.save_modal.title" />
        </DialogHeader>
        <DialogContent contentClass={classes.dialogContent}>
          <FormattedMessage id="admin.save_modal.description" />
        </DialogContent>
        <DialogFooter
          classes={classes}
          onClose={onCancel}
          onSubmit={onConfirm}
        />
      </Dialog>
    );
  }
}

export const SaveModal = withStyles(modalStyles)(SaveModalComponent);
