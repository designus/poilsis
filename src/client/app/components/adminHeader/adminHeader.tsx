import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { AdminPageActions } from 'components/adminPageActions';
import { styles } from './styles';

export interface IAdminHeaderProps extends WithStyles<typeof styles> {
  translationId: string;
  createLink: string;
  search?: (searchTerm: string) => void;
}

const AdminHeader = React.memo<IAdminHeaderProps>(
  (props: IAdminHeaderProps) => {
    return (
      <div className={props.classes.wrapper}>
        <Typography variant="h5">
          <FormattedMessage id={props.translationId} />
        </Typography>
        <AdminPageActions
          createLink={props.createLink}
          search={props.search}
        />
      </div>
    );
  }
);

export default withStyles(styles)(AdminHeader);
