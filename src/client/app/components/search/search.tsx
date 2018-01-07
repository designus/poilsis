import * as React from 'react';
import styled from 'styled-components';
import Input from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';
import SearchIcon from 'material-ui-icons/Search';
// import debounce from 'lodash-es/debounce';
import { indigo } from 'material-ui/colors';
import { DIVIDER_COLOR } from '../../global-styles';

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
    borderBottom: `1px solid ${DIVIDER_COLOR}`,
  },
  focused: {
    width: '170px',
    transition: 'all .2s linear',
  },
  input: {
    padding: '7px',
    margin: '0 15px 0 0',
    color: indigo[500],
    '&::placeholder': {
      color: '#777777',
    },
  },
  icon: {
    fill: indigo[500],
  },
});

export interface ISearchBoxProps {
  search: any;
  classes: any;
}

class SearchComponent extends React.Component<ISearchBoxProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  // search = debounce(this.searchCallback, 500);
  search = this.searchCallback;

  searchCallback() {
    this.props.search(this.state.value);
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
    this.search();
  }

  render() {
    const {classes} = this.props;
    return (
      <SearchWrapper>
        <Input
          placeholder="Search"
          value={this.state.value}
          className={`${classes.root}`}
          classes={{
            input: classes.input,
            focused: classes.focused,
          }}
          disableUnderline={true}
          onChange={this.onChange}
        />
        <SearchIcon className={classes.icon} />
      </SearchWrapper>
    );
  }
};

export const SearchBox = withStyles(styles)(SearchComponent) as any;
