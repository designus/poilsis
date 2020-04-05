import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import DialogContentBox from '@material-ui/core/DialogContent';
import { extendWithLoader } from 'components/extendWithLoader';
import { styles } from '../../styles';

type Props = WithStyles<typeof styles> & {
  error?: string;
};

const Content: React.FunctionComponent<Props> = (props) => {
  return (
    <DialogContentBox className={props.classes.content}>
      <Typography component="div">
        {props.error ? props.error : props.children}
      </Typography>
    </DialogContentBox>
  );
};

export default extendWithLoader(
  withStyles(styles)(Content)
);
