import * as React from 'react';
import styled from 'styled-components';
import Input from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';
import SearchIcon from 'material-ui-icons/Search';

const SearchWrapper = styled.div`
  margin: 0 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, .3);
`;

export const styles = theme => ({
  root: {
    width: '120px',
    transition: 'all .2s linear',
  },
  focused: {
    width: '170px',
    transition: 'all .2s linear',
  },
  input: {
    padding: '7px',
    margin: '0 15px 0 0',
    color: '#fff',
  },
  icon: {
    fill: 'rgba(255, 255, 255, .3)',
  },
});

export interface ISearchBoxProps {
  searchInput: string;
  onChange: any;
  classes: any;
}

const Search = (props: ISearchBoxProps) => {
  const {searchInput, onChange, classes} = props;
  return (
    <SearchWrapper>
      <Input
        placeholder="Search"
        value={searchInput}
        className={`${classes.root}`}
        classes={{
          input: classes.input,
          focused: classes.focused,
        }}
        disableUnderline={true}
        onChange={onChange}
      />
      <SearchIcon className={classes.icon} />
    </SearchWrapper>
  );
};

export const SearchBox = withStyles(styles)(Search) as any;
