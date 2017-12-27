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
import { extendWithLoader } from '../loader';
import { blue, blueGrey, grey } from 'material-ui/colors';

const styles = theme => ({
  paper: {
    borderRadius: '0',
    minWidth: '300px',
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
    background: blue[800],
    color: '#fff',
    '&:hover': {
      background: blue[900],
    },
  },
  dialogContent: {
    paddingTop: '6px!important',
  },
  cancel: {
    background: grey[100],
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

const DialogContentWrapper = (props) => (
  <DialogContent classes={{root: props.contentClass}}>
    <DialogContentText>
      {props.error ? props.error : props.children}
    </DialogContentText>
  </DialogContent>
);

const DialogContentWithLoader = extendWithLoader(DialogContentWrapper);

export interface IDeleteModalProps {
  isDeleteModalOpen: boolean;
  loaderId: string;
  itemId: string;
  itemName: string;
  onDelete: any;
}

class DeleteModalComponent extends React.Component<IDeleteModalProps & { classes: any }, any> {

  state = {
    isModalOpen: this.props.isDeleteModalOpen,
    error: null,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.isDeleteModalOpen !== this.state.isModalOpen) {
      this.setState({isModalOpen: newProps.isDeleteModalOpen});
    }
  }

  openModal(id) {
    this.setState({isModalOpen: true, error: null});
  }

  closeModal = () => {
    this.setState({isModalOpen: false, error: null});
  }

  deleteItem = () => {
    this.props.onDelete(this.props.itemId).then(error => {
      if (error) {
        this.setState({error});
      } else {
        this.setState({error: null, isModalOpen: false});
      }
    });
  }

  render() {
    const {classes, loaderId, itemName} = this.props;
    const {error} = this.state;

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
            <span>Delete "{itemName}"?</span>
            <IconButton
              className={classes.close}
              aria-label="Close modal"
              onClick={this.closeModal}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitle>
          <DialogContentWithLoader
            error={error}
            loaderId={loaderId}
            contentClass={classes.dialogContent}
          >
            Delete is permanent, you can not revert this action.
          </DialogContentWithLoader>
          <DialogActions classes={{
            root: classes.actionWrapper,
            action: classes.buttonWrapper,
            button: classes.button,
          }}>
            <Button onClick={this.closeModal} className={classes.cancel}>
              Cancel
            </Button>
            <Button onClick={this.deleteItem} className={classes.submit}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export const DeleteModal = withStyles(styles)<IDeleteModalProps>(DeleteModalComponent);