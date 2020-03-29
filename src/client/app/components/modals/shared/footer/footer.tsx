import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
// import Button from '@material-ui/core/Button';
import { Button } from 'components/button';
import { FormattedMessage } from 'react-intl';
import { styles } from '../../styles';

type Props = Partial<WithStyles<typeof styles>> & {
  onClose: () => void;
  onSubmit: () => void;
  closeLabelId?: string;
  submitLabelId?: string;
};

const Footer = (props: Props) => (
  <DialogActions>
    <Button type="button" variant="outlined" color="default" onClick={props.onClose}>
      <FormattedMessage id={props.closeLabelId} />
    </Button>
    <Button type="submit" variant="contained" onClick={props.onSubmit}>
      <FormattedMessage id={props.submitLabelId} />
    </Button>
  </DialogActions>
);

Footer.defaultProps = {
  closeLabelId: 'common.cancel',
  submitLabelId: 'common.save'
};

export default withStyles(styles)(Footer);
