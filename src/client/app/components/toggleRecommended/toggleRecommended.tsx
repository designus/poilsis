import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import StarEmpty from '@material-ui/icons/StarBorder';
import StarFilled from '@material-ui/icons/Star';
import { styles } from './styles';

export interface IToggleRecommendedProps extends WithStyles<typeof styles> {
  isRecommended: boolean;
  onToggle: () => void;
}

function ToggleRecommended(props: IToggleRecommendedProps) {
  const { classes, isRecommended, onToggle} = props;
  return (
    <div className={classes.wrapper} onClick={onToggle}>
      {isRecommended ? <StarFilled className={classes.icon} /> : <StarEmpty className={classes.icon} />}
    </div>
  );
}

export default withStyles(styles)(ToggleRecommended);
