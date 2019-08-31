import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { IAppState } from 'types';
import { Dropdown } from 'components/dropdown';
import { LANGUAGES } from 'global-utils';
import { IDropdownOption } from 'types/generic';
import { capitalize } from 'client-utils/methods';
import { switchLanguage } from 'actions/locale';

import { styles  } from './styles';

const mapLanguagesToDropdown = (languages: string[]): IDropdownOption[] =>
  languages.map(locale => ({ label: capitalize(locale), value: locale }));

interface ILanguageSelectorProps extends Partial<WithStyles<typeof styles>>, RouteComponentProps<any> {
  onSelectLanguage: (language: string) => () => void;
  selectedLanguage: string;
  reloadPageOnChange?: boolean;
}

export class LanguageSelector extends React.PureComponent<ILanguageSelectorProps>  {

  options = mapLanguagesToDropdown(LANGUAGES);

  onChange = (locale: string) => {
    if (this.props.reloadPageOnChange) {
      window.location.href = this.props.location.pathname.replace(new RegExp('(' + LANGUAGES.join('|') + ')'), locale);
    } else {
      this.props.onSelectLanguage(locale);
    }
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <Dropdown
          options={this.options}
          selectedValue={this.props.selectedLanguage}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  selectedLanguage: state.locale
});

const mapDispatchToProps = dispatch => ({
  onSelectLanguage: (language: string) => dispatch(switchLanguage(language))
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(
    withRouter(LanguageSelector)
  )
);
