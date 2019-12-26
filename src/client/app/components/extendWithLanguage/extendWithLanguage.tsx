import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { Languages } from 'global-utils/typings';
import { IAppState } from 'types';
import { getAdminLocale } from 'selectors';
import { LANGUAGES } from 'global-utils';

import { languageStyles } from './styles';

interface IInjectedProps extends Partial<WithStyles<typeof languageStyles>> {
  selectedLanguage?: string;
  locale?: Languages;
}

export function extendWithLanguage<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentType<TOriginalProps & IInjectedProps>
  ): React.ComponentType<TOriginalProps & IInjectedProps> {

    type ResultProps = TOriginalProps & IInjectedProps;
    class FormLanguageComponent extends React.Component<ResultProps> {
      state = {
        selectedLanguage: this.props.locale
      };

      onSelectLanguage = selectedLanguage => () => {
        this.setState({
          selectedLanguage
        });
      }

      renderLanguageOption = (language: string) => {
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

    return withStyles(languageStyles)(
      // @ts-ignore
      connect<{}, {}, any>(mapStateToProps)(FormLanguageComponent)
    );
}
