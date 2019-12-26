import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { clientRoutes } from 'client-utils/routes';
import { Dropdown } from 'components/dropdown';
import { LANGUAGES, Languages } from 'global-utils';
import { IDropdownOption } from 'types/generic';
import { IAppState } from 'types';
import { capitalize } from 'client-utils/methods';

import { switchLanguage } from 'actions/locale';
import { LanguageSelectorProps, IOwnProps, IDispatchProps } from './types';

import { styles } from './styles';

export function LanguageSelector(props: LanguageSelectorProps)  {
  const { isAdmin, onSelectLanguage, classes, locale } = props;

  const options = React.useMemo((): IDropdownOption[] =>
    LANGUAGES.map(locale => ({ label: capitalize(locale), value: locale })),
    []
  );

  const onChange = (locale: Languages) => {
    onSelectLanguage(locale, isAdmin);
    if (!isAdmin) {
      props.history.push(clientRoutes.landing.getLink(locale));
    }
  };

  return (
    <div className={`${classes.wrapper} ${isAdmin ? classes.admin : ''}`}>
      <Dropdown
        options={options}
        selectedValue={locale}
        onChange={onChange}
      />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  onSelectLanguage: (language: Languages, isAdmin: boolean) => dispatch(switchLanguage(language, isAdmin))
});

export default withStyles(styles)(
  withRouter(
    connect<{}, IDispatchProps, IOwnProps, IAppState>(undefined, mapDispatchToProps)(
      LanguageSelector
    )
  )
);
