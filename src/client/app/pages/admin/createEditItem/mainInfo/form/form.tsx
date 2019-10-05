import * as React from 'react';
import { AxiosResponse } from 'axios';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { ICitiesMap, ITypesMap, IUsersMap } from 'types';
import { getDropdownOptions } from 'client-utils/methods';
import { isAdmin, itemValidation, isRequired, minCheckedCount, maxCheckedCount, IItem } from 'global-utils';

import { Button } from 'components/button';
import { TextInput } from 'components/formFields/textInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';
import { SelectBox } from 'components/formFields/selectBox';
import { Switcher } from 'components/formFields/switch';
import { http } from 'actions/utils';

const minTypesCount = minCheckedCount(itemValidation.types.minCheckedCount);
const maxTypesCount = maxCheckedCount(itemValidation.types.maxCheckedCount);

const asyncValidate = (item: IItem) => {
  const { id, name, alias } = item;
  return http.post('/api/items/item/alias-exist', { id, name, alias })
    .then((response: AxiosResponse<boolean>) => response.data)
    .then(doesExist => {
      if (doesExist) {
        throw {
          alias: 'This alias already exist'
        };
      }
      return undefined;
    });
};

export const MAIN_INFO_FORM_NAME = 'MainInfoForm';

interface ICustomProps {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  usersMap: IUsersMap;
  userRole: string;
  locale: string;
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
  selectedLanguage?: string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, formatMessage, locale } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label={formatMessage({ id: 'admin.common_fields.name'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        intl
        component={TextInput}
        selectedLanguage={selectedLanguage}
        label={formatMessage({ id: 'admin.common_fields.alias'})}
      />
      <Field
        name="address"
        type="text"
        validate={[isRequired]}
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.address'})}
      />
      <Field
        name="cityId"
        component={SelectBox}
        validate={[isRequired]}
        label={formatMessage({ id: 'admin.common_fields.city'})}
        options={getDropdownOptions(props.citiesMap, 'name', locale)}
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[isRequired]}
          label={formatMessage({ id: 'admin.common_fields.user'})}
          data={props.usersMap}
          options={getDropdownOptions(props.usersMap, 'name', locale)}
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minTypesCount, maxTypesCount]}
        label={formatMessage({ id: 'admin.common_fields.types'})}
        options={getDropdownOptions(props.typesMap, 'name', locale)}
      />
      {isAdmin(props.userRole) &&
        <Field
          name="isEnabled"
          component={Switcher}
          label={formatMessage({ id: 'admin.common_fields.is_enabled'})}
        />
      }
      <div>
        <Button type="submit" disabled={submitting || pristine}>
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const MainInfoForm = reduxForm<{}, ICustomProps>({
  asyncValidate,
  asyncBlurFields: ['alias'],
  form: MAIN_INFO_FORM_NAME
})(Form);
