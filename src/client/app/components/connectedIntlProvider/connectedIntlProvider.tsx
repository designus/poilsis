import * as React from 'react';
import { IntlProvider } from 'react-intl';

import { getTranslationMessages } from 'global-utils/methods';
import { Locale } from 'global-utils/typings';

interface IConnectedIntlProps {
  locale: Locale;
}

export class ConnectedIntlProvider extends React.Component<IConnectedIntlProps> {
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
