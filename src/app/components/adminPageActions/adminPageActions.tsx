import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { indigo, grey } from 'material-ui/colors';

const Wrapper = styled.div`
  padding: 5px 10px;
  border-radius: 30px;
  border: 1px solid ${grey[300]};
  display: inline-block;
  float:right;
  min-width: 120px;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
  classes?: any;
}

const PageActionsComponent = ({classes, createLink}: IAdminPageActions) => {
  return (
    <Wrapper>
      <FlexContainer>
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
