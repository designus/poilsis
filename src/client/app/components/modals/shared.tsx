import * as React from 'react';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContentBox from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { FormattedMessage } from 'react-intl';

import { extendWithLoader } from 'components';

export const DialogContentWrapper = (props) => (
  <DialogContentBox classes={{root: props.contentClass}}>
    <DialogContentText>
      {props.error ? props.error : props.children}
    </DialogContentText>
  </DialogContentBox>
);

export const DialogContent = extendWithLoader(DialogContentWrapper);

export const DialogHeader = ({className, closeModal, children}) => (
  <DialogTitle>
    {children}
    <IconButton
      className={className}
      aria-label="Close modal"
      onClick={closeModal}
    >
      <ClearIcon />
    </IconButton>
  </DialogTitle>
);

export const DialogFooter = ({
  classes,
  onClose,
  onSubmit,
  closeLabelId = 'common.cancel',
  submitLabelId = 'common.proceed',
}) => (
  <DialogActions classes={{
    root: classes.actionWrapper,
    action: classes.buttonWrapper,
  }}>
    <Button variant="contained" onClick={onClose} className={classes.cancel}>
      <FormattedMessage id={closeLabelId} />
    </Button>
    <Button color="primary" variant="contained" onClick={onSubmit} className={classes.submit}>
      <FormattedMessage id={submitLabelId} />
    </Button>
  </DialogActions>
);
