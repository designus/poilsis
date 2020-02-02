import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types';
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { getAdminLocale } from 'selectors';
import { Locale } from 'global-utils/typings';
import AdminLayoutContent from './layout';

interface IStateProps  {
  locale: Locale;
}

class AdminLayoutPage extends React.PureComponent<IStateProps> {
  render() {
    const { locale } = this.props;
    return (
      <ConnectedIntlProvider locale={locale}>
        <AdminLayoutContent />
      </ConnectedIntlProvider>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  locale: getAdminLocale(state)
});

export default connect<IStateProps, {}, {}, IAppState>(mapStateToProps)(AdminLayoutPage);
