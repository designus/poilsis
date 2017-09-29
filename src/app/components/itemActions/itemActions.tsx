import * as React from 'react';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/ModeEdit';
import styled from 'styled-components';
import { Link } from 'react-router';

const StyledActions = styled.div`
  display: flex;
`;

const DeleteIconStyled = styled(DeleteIcon)`
  fill: #777171!important;
`;

const EditIconStyled = styled(EditIcon)`
  fill: #4286f4!important;
`;

interface IItemActions {
  editLink: string;
  onDelete: any;
}

export const ItemActions = (props: IItemActions) => {
  return (
    <StyledActions>
      <Link	to={props.editLink}>
        <EditIconStyled />
      </Link>
      <div onClick={props.onDelete}>
        <DeleteIconStyled />
      </div>
    </StyledActions>
  );
};
