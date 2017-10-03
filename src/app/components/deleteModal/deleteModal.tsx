import * as React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import { blue, blueGrey } from 'material-ui/colors';

const styles = theme => ({
  paper: {
    borderRadius: '0',
  },
  actionWrapper: {
    margin: '8px 0 0 0',
  },
  buttonWrapper: {
    width: '50%',
    textAlign: 'center',
    margin: '0',
  },
  button: {
    width: '100%',
    borderRadius: '0',
  },
  submit: {
    'background': blue[800],
    'color': '#fff',
    '&:hover': {
      background: blue[900],
    },
  },
  cancel: {
    'background': blueGrey[50],
    '&:hover': {
      background: blueGrey[100],
    },
  },
  close: {
    position: 'absolute' as 'absolute',
    top: '0',
    right: '0',
  },
});

export interface IDeleteModalProps {
  isDeleteModalOpen: boolean;
  onDelete: any;
  classes?: any;
}

class DeleteModalComponent extends React.Component<IDeleteModalProps & { classes: any }, any> {

  state = {
    isModalOpen: this.props.isDeleteModalOpen,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.isDeleteModalOpen !== this.state.isModalOpen) {
      this.setState({isModalOpen: newProps.isDeleteModalOpen});
    }
  }

  openModal(id) {
    this.setState({isModalOpen: true});
  }

  closeModal = () => {
    this.setState({isModalOpen: false});
  }

  render() {
    const classes = this.props.classes;
    return (
      <div>
        <Dialog
          open={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          classes={{
            paper: classes.paper,
          }}
        >
          <DialogTitle>
            <span>Delete?</span>
            <IconButton
              className={classes.close}
              aria-label="Close modal"
              onClick={this.closeModal}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Delete is permanent, you can not revert this action.
            </DialogContentText>
          </DialogContent>
          <DialogActions classes={{
            root: classes.actionWrapper,
            action: classes.buttonWrapper,
            button: classes.button,
          }}>
            <Button onClick={this.closeModal} className={classes.cancel}>
              Cancel
            </Button>
            <Button onClick={this.closeModal} className={classes.submit}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export const DeleteModal = withStyles<IDeleteModalProps>(styles)(DeleteModalComponent);
