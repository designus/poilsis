import * as React from 'react';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContentBox from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
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
  }}>
    <Button variant="raised" onClick={onClose} className={classes.cancel}>
      {closeLabel}
    </Button>
    <Button color="primary" variant="raised" onClick={onSubmit} className={classes.submit}>
      {submitLabel}
    </Button>
  </DialogActions>
);
