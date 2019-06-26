import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { styles } from './styles';

interface IItemActions extends WithStyles<typeof styles> {
  editLink: string;
  onDelete: any;
}

const ItemActions = (props: IItemActions) => {
  const { classes } = props;
  return (
    <div className={classes.wrapper}>
      <Link className={`${classes.edit} ${classes.link}`} to={props.editLink}>
        <EditIcon />
      </Link>
      <a className={`${classes.delete} ${classes.link}`} onClick={props.onDelete}>
        <DeleteIcon />
      </a>
    </div>
  );
};

export default withStyles(styles)(ItemActions);
