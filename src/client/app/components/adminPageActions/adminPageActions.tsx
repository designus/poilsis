import * as React from 'react';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { SearchBox } from '../search';

import { styles } from './styles';

interface IAdminPageActions extends WithStyles<typeof styles> {
  createLink: string;
  search?: (value: string) => void;
}

const AdminPageActions = ({classes, createLink, search}: IAdminPageActions) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.flexContainer}>
        {typeof search === 'function' ?
          <SearchBox search={search} /> :
          null
        }
        <Link to={createLink}>
          <Fab aria-label="Create" className={`${classes.button}`}>
            <AddIcon className={classes.icon} />
          </Fab>
        </Link>
      </div>
    </div>
  );
};

export default withStyles(styles)(AdminPageActions);
