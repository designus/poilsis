import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

interface IOwnProps extends InjectedIntlProps {
}

type Props = IOwnProps;

const AdminHomePage: React.FunctionComponent<Props> = (props) => {
  return (
    <div>Admin home page</div>
  );
};

export default injectIntl(AdminHomePage);
