import * as React from 'react';

import {
  DialogActions,
  DialogContent as DialogContentBox,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import { extendWithLoader } from '../loader';

export const DialogContentWrapper = (props) => (
  <DialogContentBox classes={{root: props.contentClass}}>
    <DialogContentText>
      {props.error ? props.error : props.children}
    </DialogContentText>
  </DialogContentBox>
);

export const DialogContent = extendWithLoader(DialogContentWrapper);

export const DialogHeader = ({title, className, closeModal}) => (
  <DialogTitle>
    <span>{title}</span>
    <IconButton
      className={className}
      aria-label="Close modal"
      onClick={closeModal}
    >
      <ClearIcon />
    </IconButton>
  </DialogTitle>
);

export const DialogFooter = ({classes, onClose, onSubmit, closeLabel = 'Cancel', submitLabel = 'Proceed'}) => (
  <DialogActions classes={{
    root: classes.actionWrapper,
    action: classes.buttonWrapper,
    button: classes.button,
  }}>
    <Button onClick={onClose} className={classes.cancel}>
      Cancel
    </Button>
    <Button onClick={onSubmit} className={classes.submit}>
      Proceed
    </Button>
  </DialogActions>
);
