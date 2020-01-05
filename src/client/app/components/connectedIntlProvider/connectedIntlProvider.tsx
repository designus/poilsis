import * as React from 'react';
import { IntlProvider } from 'react-intl';

import { getTranslationMessages } from 'global-utils/methods';

interface IConnectedIntlProps {
  locale?: string;
}

export class ConnectedIntlProvider extends React.Component<IConnectedIntlProps, any> {
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={getTranslationMessages(this.props.locale)}
      >
        {this.props.children}
      </IntlProvider>
    );
  }
}
