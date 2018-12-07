import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { LANGUAGES } from 'global-utils';

import { styles  } from './styles';

interface ILanguageSelectorProps extends Partial<WithStyles<typeof styles>> {
  type: 'dropdown' | 'list';
  onSelectLanguage: (language: string) => () => void;
  selectedLanguage: string;
}

export class LanguageSelector extends React.PureComponent<ILanguageSelectorProps>  {
  renderLanguageOption = (language: string) => {
    const { classes, selectedLanguage, onSelectLanguage } = this.props;
    return (
      <div
        className={`
          ${classes.languageOption}
          ${selectedLanguage === language ? classes.active : ''}
        `}
        onClick={onSelectLanguage(language)}
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
      <div className={this.props.classes.wrapper}>
        {LANGUAGES.map(this.renderLanguageOption)}
      </div>
    );
  }
}

export default withStyles(styles)(LanguageSelector);
