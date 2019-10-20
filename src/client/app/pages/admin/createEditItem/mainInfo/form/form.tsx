import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Dispatch } from 'react-redux';
import { FormattedMessage, InjectedIntl } from 'react-intl';
import { ICitiesMap, ITypesMap, IUsersMap } from 'types';
import { getDropdownOptions } from 'client-utils/methods';
import { isAdmin, itemValidation, isRequired, minCheckedCount, maxCheckedCount, IItem, DEFAULT_LANGUAGE } from 'global-utils';
import { asyncValidateAlias } from 'actions';

import { Button } from 'components/button';
import { TextInput } from 'components/formFields/textInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';
import { SelectBox } from 'components/formFields/selectBox';
import { Switcher } from 'components/formFields/switch';

const minTypesCount = minCheckedCount(itemValidation.types.minCheckedCount);
const maxTypesCount = maxCheckedCount(itemValidation.types.maxCheckedCount);

export const MAIN_INFO_FORM_NAME = 'MainInfoForm';

interface ICustomProps {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  usersMap: IUsersMap;
  userRole: string;
  locale: string;
  intl: InjectedIntl;
  selectedLanguage?: string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, intl, locale } = props;

  const isHidden = (hasIntl: boolean) => !hasIntl && selectedLanguage !== DEFAULT_LANGUAGE;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label={intl.formatMessage({ id: 'admin.common_fields.name'})}
        hasIntl
        isHidden={isHidden(true)}
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        hasIntl
        component={TextInput}
        selectedLanguage={selectedLanguage}
        isHidden={isHidden(true)}
        label={intl.formatMessage({ id: 'admin.common_fields.alias'})}
      />
      <Field
        name="address"
        type="text"
        validate={[isRequired]}
        component={TextInput}
        isHidden={isHidden(false)}
        label={intl.formatMessage({ id: 'admin.common_fields.address'})}
      />
      <Field
        name="cityId"
        component={SelectBox}
        validate={[isRequired]}
        isHidden={isHidden(false)}
        label={intl.formatMessage({ id: 'admin.common_fields.city'})}
        options={getDropdownOptions(props.citiesMap, 'name', locale)}
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[isRequired]}
          label={intl.formatMessage({ id: 'admin.common_fields.user'})}
          isHidden={isHidden(false)}
          data={props.usersMap}
          options={getDropdownOptions(props.usersMap, 'name', locale)}
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minTypesCount, maxTypesCount]}
        label={intl.formatMessage({ id: 'admin.common_fields.types'})}
        isHidden={isHidden(false)}
        options={getDropdownOptions(props.typesMap, 'name', locale)}
      />
      <Field
        name="isEnabled"
        component={Switcher}
        isHidden={isHidden(true)}
        selectedLanguage={selectedLanguage}
        hasIntl
        label={intl.formatMessage({ id: 'admin.common_fields.is_enabled'})}
      />
      <div>
        <Button type="submit" disabled={submitting || pristine}>
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const MainInfoForm = reduxForm<IItem, ICustomProps>({
  asyncValidate: (item: IItem, dispatch: Dispatch<any>, props) => {
    return asyncValidateAlias(item, '/api/items/item/alias-exist', props.intl);
  },
  asyncBlurFields: ['alias'],
  form: MAIN_INFO_FORM_NAME
})(Form);
