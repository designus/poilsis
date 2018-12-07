import * as React from 'react';

import { LanguageSelector } from 'components';
import { getSelectedLanguage } from 'client-utils';

interface IInjectedProps {
  selectedLanguage?: string;
}

export function extendWithLanguage<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentType<TOriginalProps & IInjectedProps>,
  ): React.ComponentType<TOriginalProps & IInjectedProps> {

    class FormLanguageComponent extends React.Component<TOriginalProps & IInjectedProps> {
      state = {
        selectedLanguage: getSelectedLanguage(),
      };

      onSelectLanguage = selectedLanguage => () => {
        this.setState({
          selectedLanguage,
        });
      }

      render() {
        return (
          <div>
            <LanguageSelector
              type="list"
              selectedLanguage={this.state.selectedLanguage}
              onSelectLanguage={this.onSelectLanguage}
            />
            <WrappedComponent selectedLanguage={this.state.selectedLanguage} {...this.props} />
          </div>
        );
      }
    }

    // @ts-ignore
    return FormLanguageComponent;
}
