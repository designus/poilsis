import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { indigo } from 'material-ui/colors';
import { SearchBox } from '../search';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FlexContainer = styled.div`
  display: flex;
  border-radius: 30px;
  padding: 5px 10px;  
  justify-content: space-between;

  a {
    height: 30px;
  }
`;

const styles = theme => ({
  button: {
    width: '30px',
    height: '30px',
    minHeight: '30px',
    boxShadow: 'none',
    margin: '0 5px',
    backgroundColor: indigo[500],
    '&:hover': {
      backgroundColor: indigo[700],
    },
    '&:active': {
      boxShadow: 'none',
    },
  },
  icon: {
    color: '#fff',
  },
});

interface IAdminPageActions {
  createLink: string;
  search?: (value) => void;
  classes?: any;
}

const PageActionsComponent = ({classes, createLink, search}: IAdminPageActions) => {
  return (
    <Wrapper>
      <FlexContainer>
        {typeof search === 'function' ?
          <SearchBox search={search} /> :
          null
        }
        <Link to={createLink}>
          <Button fab aria-label="Create" className={`${classes.button}`}>
            <AddIcon className={classes.icon} />
          </Button>
        </Link>
      </FlexContainer>  
    </Wrapper>
  );
};

export const AdminPageActions = withStyles(styles)<IAdminPageActions>(PageActionsComponent);
