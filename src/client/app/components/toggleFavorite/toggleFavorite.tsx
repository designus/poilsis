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
    <div className={classes.wrapper} onClick={onToggle}>
      {isFavorite ? <StarFilled className={classes.icon} /> : <StarEmpty className={classes.icon} />}
    </div>
  );
}

export default withStyles(styles)(ToggleFavorite);
