import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { Locale } from 'global-utils/typings';
import { IAppState } from 'types';
import { getAdminLocale } from 'selectors';
import { LANGUAGES } from 'global-utils';

import { languageStyles } from './styles';

type InjectedProps = {
  selectedLanguage?: Locale;
  locale?: Locale;
};

export function extendWithLanguage<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentType<TOriginalProps & InjectedProps>
  ): React.ComponentType<TOriginalProps & InjectedProps> {

    type ResultProps = TOriginalProps & InjectedProps & WithStyles<typeof languageStyles>;
    class FormLanguageComponent extends React.Component<ResultProps> {
      state = {
        selectedLanguage: this.props.locale
      };

      onSelectLanguage = (selectedLanguage: Locale) => () => {
        this.setState({
          selectedLanguage
        });
      }

      renderLanguageOption = (language: Locale) => {
        const { classes } = this.props;
        return (
          <div
            className={`
              ${classes.languageOption}
              ${this.state.selectedLanguage === language ? classes.active : ''}
            `}
            onClick={this.onSelectLanguage(language)}
            key={language}
          >
            <Typography variant="caption" classes={{root: classes.typography}}>
              {language}
            </Typography>
          </div>
        );
      }

      render() {
        return (
          <div>
            <div className={this.props.classes.wrapper}>
              {LANGUAGES.map(this.renderLanguageOption)}
            </div>
            <WrappedComponent selectedLanguage={this.state.selectedLanguage} {...this.props} />
          </div>
        );
      }
    }

    const mapStateToProps = (state: IAppState) => ({
      locale: getAdminLocale(state)
    });

    // @ts-ignore
    return withStyles(languageStyles)(
      // @ts-ignore
      connect<{}, {}, {}, IAppState>(mapStateToProps)(FormLanguageComponent)
    );
}
