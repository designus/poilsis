import * as React from 'react';
import Input from '@material-ui/core/Input';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from 'lodash';
import { styles } from './styles';

export interface ISearchBoxProps extends WithStyles<typeof styles> {
  search: any;
  classes: any;
}

class SearchComponent extends React.Component<ISearchBoxProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  search = debounce(this.searchCallback, 500);

  searchCallback() {
    this.props.search(this.state.value);
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
    this.search();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.searchWrapper}>
        <Input
          placeholder="Search"
          value={this.state.value}
          className={`${classes.root}`}
          classes={{
            input: classes.input,
            focused: classes.focused
          }}
          disableUnderline={true}
          onChange={this.onChange}
        />
        <SearchIcon className={classes.icon} />
      </div>
    );
  }
}

export const SearchBox = withStyles(styles)(SearchComponent) as any;
