import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types';
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { getAdminLocale } from 'selectors';
import AdminLayoutContent from './layout';

interface IAdminLayoutProps  {
  locale: string;
}

class AdminLayoutPage extends React.PureComponent<IAdminLayoutProps, any> {
  render() {
    const { locale } = this.props;
    return (
      <ConnectedIntlProvider locale={locale}>
        <AdminLayoutContent />
      </ConnectedIntlProvider>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  locale: getAdminLocale(state)
});

export default connect<any, any, IAdminLayoutProps>(mapStateToProps)(AdminLayoutPage);
