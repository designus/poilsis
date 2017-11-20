import * as React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    borderRadius: '20px',
    minWidth: '120px',
    margin: '20px 0',
  },
});

export const SubmitButton = (props) => {
  return (
    <Button
      classes={{
        root: props.classes.root,
      }}
      raised
      color="primary"
      type="submit"
    >
      {props.children}
    </Button>
  );
};

export const Submit = withStyles(styles)(SubmitButton);
