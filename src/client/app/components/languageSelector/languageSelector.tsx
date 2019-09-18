import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Dropdown } from 'components/dropdown';
import { LANGUAGES } from 'global-utils';
import { IDropdownOption } from 'types/generic';
import { capitalize } from 'client-utils/methods';
import { switchLanguage } from 'actions/locale';

import { styles  } from './styles';

const mapLanguagesToDropdown = (languages: string[]): IDropdownOption[] =>
  languages.map(locale => ({ label: capitalize(locale), value: locale }));

interface ILanguageSelectorProps extends Partial<WithStyles<typeof styles>>, RouteComponentProps<any> {
  onSelectLanguage: (locale: string, isAdmin: boolean) => () => void;
  locale: string;
  isAdmin: boolean;
}

export class LanguageSelector extends React.PureComponent<ILanguageSelectorProps>  {

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
  connect(undefined, mapDispatchToProps)(
    withRouter(LanguageSelector)
  )
);
