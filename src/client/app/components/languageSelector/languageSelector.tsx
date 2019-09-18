import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { Dropdown } from 'components/dropdown';
import { LANGUAGES } from 'global-utils';
import { IDropdownOption } from 'types/generic';
import { capitalize } from 'client-utils/methods';
import { switchLanguage } from 'actions/locale';
import { LanguageSelectorProps, IOwnProps, IDispatchProps } from './types';

import { styles } from './styles';

const mapLanguagesToDropdown = (languages: string[]): IDropdownOption[] =>
  languages.map(locale => ({ label: capitalize(locale), value: locale }));

export class LanguageSelector extends React.PureComponent<LanguageSelectorProps>  {

  options = mapLanguagesToDropdown(LANGUAGES);

  onChange = (locale: string) => {
    this.props.onSelectLanguage(locale, this.props.isAdmin);
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <Dropdown
          options={this.options}
          selectedValue={this.props.locale}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSelectLanguage: (language: string, isAdmin: boolean) => dispatch(switchLanguage(language, isAdmin))
});

export default withStyles(styles)(
  withRouter(
    connect<{}, IDispatchProps, IOwnProps>(undefined, mapDispatchToProps)(
      LanguageSelector
    )
  )
);
