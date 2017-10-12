import * as React from 'react';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/ModeEdit';
import Button from 'material-ui/Button';
import styled from 'styled-components';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import { red, indigo, blueGrey } from 'material-ui/colors';

const StyledActions = styled.div`
  display: flex;
`;

const styles = theme => ({
  button: {
    'width': '36px',
    'height': '36px',
    'boxShadow': 'none',
    'margin': '0 5px',
    '&:active': {
      boxShadow: 'none',
    },
  },
  edit: {
    'backgroundColor': blueGrey[100],
    '&:hover': {
      backgroundColor: indigo[700],
    },
  },
  delete: {
    'backgroundColor': blueGrey[100],
    '&:hover': {
      backgroundColor: red[600],
    },
  },
  icon: {
    color: '#fff',
  },
});

interface IItemActions {
  editLink: string;
  onDelete: any;
  classes?: any;
}

const ItemActionsComponent = (props: IItemActions) => {
  const {classes} = props;
  return (
    <StyledActions>
      <Link	to={props.editLink}>
        <Button fab aria-label="Edit" className={`${classes.button} ${classes.edit}`}>
          <EditIcon className={classes.icon} />
        </Button>
      </Link>
      <div onClick={props.onDelete}>
        <Button fab aria-label="Delete" className={`${classes.button} ${classes.delete}`}>
          <DeleteIcon className={classes.icon} />
        </Button>
      </div>
    </StyledActions>
  );
};

export const ItemActions = withStyles(styles)<IItemActions>(ItemActionsComponent);
