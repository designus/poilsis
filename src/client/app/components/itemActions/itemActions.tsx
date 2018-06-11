import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/ModeEdit';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';

const StyledActions = styled.div`
  display: flex;

  a {
    display: flex;
    width: 36px;
    height: 36px;
    margin: 0 5px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      color: #fff;
    }

    &.edit {
      background: ${blueGrey[100]};
      &:hover {
        background: ${indigo[700]};
      }
    }

    &.delete {
      background: ${blueGrey[100]};
      &:hover {
        background: ${red[600]};
      }
    }
  }
`;

interface IItemActions {
  editLink: string;
  onDelete: any;
}

export const ItemActions = (props: IItemActions) => {
  return (
    <StyledActions>
      <Link className="edit" to={props.editLink}>
        <EditIcon />
      </Link>
      <a className="delete" onClick={props.onDelete}>
        <DeleteIcon />
      </a>
    </StyledActions>
  );
};
