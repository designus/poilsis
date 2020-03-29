import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'components/button';

type Props = RouteComponentProps<any> & {
  backLink: string;
  isSubmitDisabled?: boolean;
};

const AdminFormActions = (props: Props) => {

  const handleBackClick = () => props.history.push(props.backLink);

  return (
    <div>
      <Button onClick={handleBackClick} type="button" variant="outlined" color="default">
        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
      </Button>
      <Button type="submit" variant="contained" disabled={Boolean(props.isSubmitDisabled)}>
        <FormattedMessage id="common.save" defaultMessage="Save" />
      </Button>
    </div>
  );
};

export default withRouter(AdminFormActions);
