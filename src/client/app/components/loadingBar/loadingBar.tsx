import * as React from 'react';
import LoadingBar from 'react-redux-loading-bar';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { styles } from './styles';

type Props = WithStyles<typeof styles> & {
  isAdmin?: boolean;
};

const Loader: React.FunctionComponent<Props> = (props) => {
  return (
    <div className={`${props.classes.wrapper} ${props.isAdmin ? props.classes.admin : ''}`}>
      <LoadingBar />
    </div>
  );
};

export default withStyles(styles)(Loader);
