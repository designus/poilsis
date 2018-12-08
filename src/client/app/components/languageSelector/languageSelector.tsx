import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import { IAppState } from 'reducers';
import { Dropdown } from 'components';
import { LANGUAGES } from 'global-utils';
import { IDropdownOption, capitalize } from 'client-utils';
import { switchLanguage } from 'actions';

import { styles  } from './styles';

const mapLanguagesToDropdown = (languages: string[]): IDropdownOption[] =>
  languages.map(locale => ({ label: capitalize(locale), value: locale }));

interface ILanguageSelectorProps extends Partial<WithStyles<typeof styles>> {
  onSelectLanguage: (language: string) => () => void;
  selectedLanguage: string;
}

export class LanguageSelector extends React.PureComponent<ILanguageSelectorProps>  {

  options = mapLanguagesToDropdown(LANGUAGES);

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <Dropdown
          options={this.options}
          selectedValue={this.props.selectedLanguage}
          onChange={this.props.onSelectLanguage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  selectedLanguage: state.locale,
});

const mapDispatchToProps = dispatch => ({
  onSelectLanguage: (language: string) => dispatch(switchLanguage(language)),
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LanguageSelector),
);
