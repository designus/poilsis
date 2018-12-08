import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import { getSelectedLanguage } from 'client-utils';
import { LANGUAGES } from 'global-utils';

import { styles  } from './styles';

interface IInjectedProps extends Partial<WithStyles<typeof styles>> {
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

    // @ts-ignore
    return withStyles(styles)(FormLanguageComponent);
}
