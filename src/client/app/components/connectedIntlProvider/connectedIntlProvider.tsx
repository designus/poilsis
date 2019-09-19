import * as React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as lt from 'react-intl/locale-data/lt';
import * as ru from 'react-intl/locale-data/ru';
import { getTranslationMessages } from 'global-utils/methods';

addLocaleData([...en, ...lt, ...ru]);

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
