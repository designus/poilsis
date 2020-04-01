import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { clientRoutes } from 'client-utils/routes';
import { Dropdown } from 'components/dropdown';
import { LANGUAGES, Locale } from 'global-utils';
import { IDropdownOption } from 'types/generic';
import { capitalize } from 'client-utils/methods';

import { switchLanguage } from 'actions/locale';

import { useStyles } from './styles';

export type Props = {
  locale: Locale;
  isAdmin: boolean;
};

export function LanguageSelector(props: Props)  {
  const { isAdmin, locale } = props;
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const options = React.useMemo((): IDropdownOption[] =>
    LANGUAGES.map(locale => ({ label: capitalize(locale), value: locale })),
    []
  );

  const onChange = (locale: any) => {
    dispatch(switchLanguage(locale, isAdmin));
    if (!isAdmin) {
      history.push(clientRoutes.landing.getLink(locale));
    }
  };

  return (
    <div className={classes.wrapper}>
      <Dropdown
        options={options}
        selectedValue={locale}
        onChange={onChange}
      />
    </div>
  );
}

export default memo(LanguageSelector);
