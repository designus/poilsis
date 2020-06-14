import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import { getDropdownOptions } from 'client-utils/methods';
import { adminRoutes } from 'client-utils/routes';
import { City } from 'global-utils/data-models';
import { DEFAULT_LANGUAGE, requiredWhenEnabled } from 'global-utils';
import { asyncValidateAlias } from 'actions';

import { TextInput } from 'components/formFields/textInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';
import { Switcher } from 'components/formFields/switch';
import { AdminFormActions } from 'components/adminFormActions';

import { ICustomProps, Props } from './types';

export const CITY_FORM_NAME = 'CityForm';

const Form = (props: Props) => {
  const { handleSubmit, selectedLanguage, intl, locale } = props;

  const isHidden = () => selectedLanguage !== DEFAULT_LANGUAGE;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[requiredWhenEnabled]}
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
        isHidden={isHidden()}
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
      <Field
        name="metaTitle"
        type="text"
        component={TextInput}
        label={intl.formatMessage({ id: 'admin.common_fields.meta_title'})}
        hasIntl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="metaDescription"
        type="text"
        component={TextInput}
        label={intl.formatMessage({ id: 'admin.common_fields.meta_description'})}
        hasIntl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="isEnabled"
        component={Switcher}
        selectedLanguage={selectedLanguage}
        hasIntl
        label={intl.formatMessage({ id: 'admin.common_fields.is_enabled'})}
      />
      <AdminFormActions backLink={adminRoutes.cities.getLink()} />
    </form>
  );
};

export const CityForm = reduxForm<City, ICustomProps>({
  asyncValidate: (values: City, dispatch, props) => {
    return asyncValidateAlias(values, '/api/cities/city/alias-exist', props.intl);
  },
  asyncBlurFields: ['alias'],
  form: CITY_FORM_NAME
})(Form);
