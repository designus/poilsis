import * as React from 'react';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/ModeEdit';
import IconButton from 'material-ui/IconButton';
import styled from 'styled-components';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import { red, indigo } from 'material-ui/colors';

const StyledActions = styled.div`
  display: flex;
`;

const styles = theme => ({
  button: {
    width: '30px',
    height: '30px',
  },
  edit: {
    color: indigo[500],
  },
  delete: {
    color: red[400],
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
        <IconButton aria-label="Edit" className={classes.button}>
          <EditIcon className={classes.edit} />
        </IconButton>
      </Link>
      <div onClick={props.onDelete}>
        <IconButton aria-label="Delete" className={classes.button}>
          <DeleteIcon className={classes.delete} />
        </IconButton>
      </div>
    </StyledActions>
  );
};

export const ItemActions = withStyles<IItemActions>(styles)(ItemActionsComponent);
