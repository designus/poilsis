import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import StarEmpty from '@material-ui/icons/StarBorder';
import StarFilled from '@material-ui/icons/Star';
import { styles } from './styles';

export interface IToggleFavoriteProps extends WithStyles<typeof styles> {
  isFavorite: boolean;
  onToggle: () => void;
}

function ToggleFavorite(props: IToggleFavoriteProps) {
  const { classes, isFavorite, onToggle} = props;
  return (
    <a
      // className={classes.button}
      onClick={onToggle}>
        {isFavorite ? <StarFilled className={classes.icon} /> : <StarEmpty className={classes.icon} />}
    </a>
  );
}

export default withStyles(styles)(ToggleFavorite);
