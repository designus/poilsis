import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Dispatch } from 'react-redux';
import { FormattedMessage, InjectedIntl } from 'react-intl';

import { Button } from 'components/button';
import { getDropdownOptions } from 'client-utils/methods';
import { isRequired, ICity } from 'global-utils';
import { ITypesMap } from 'types';
import { asyncValidateAlias } from 'actions';

import { TextInput } from 'components/formFields/textInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';

export const CITY_FORM_NAME = 'CityForm';

interface ICustomProps {
  typesMap: ITypesMap;
  locale: string;
  selectedLanguage?: string;
  intl: InjectedIntl;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>) => {
  const { handleSubmit, selectedLanguage, intl, locale } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label={intl.formatMessage({ id: 'admin.common_fields.name' })}
        hasIntl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        hasIntl
        component={TextInput}
        label={intl.formatMessage({ id: 'admin.common_fields.alias' })}
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="types"
        component={CheckboxGroup}
        label={intl.formatMessage({ id: 'admin.common_fields.types' })}
        options={getDropdownOptions(props.typesMap, 'name', locale)}
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label={intl.formatMessage({ id: 'admin.common_fields.description' })}
        hasIntl
        selectedLanguage={selectedLanguage}
      />
      <div>
        <Button type="submit">
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const CityForm = reduxForm<ICity, ICustomProps>({
  asyncValidate: (values: ICity, dispatch: Dispatch<any>, props) => {
    return asyncValidateAlias(values, '/api/cities/city/alias-exist', props.intl);
  },
  asyncBlurFields: ['alias'],
  form: CITY_FORM_NAME
})(Form);
