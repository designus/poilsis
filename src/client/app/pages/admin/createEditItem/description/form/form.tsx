import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { CheckboxGroup, SelectBox, TextInput, Button, Switcher } from 'components';
import { ICitiesMap, ITypesMap, IUsersMap } from 'reducers';
import { getDropdownOptions } from 'client-utils';
import { isAdmin, itemValidation, isRequired, minCheckedCount, maxCheckedCount } from 'global-utils';

const minTypesCount = minCheckedCount(itemValidation.types.minCheckedCount);
const maxTypesCount = maxCheckedCount(itemValidation.types.maxCheckedCount);

export const MAIN_INFO_FORM_NAME = 'MainInfoForm';

interface ICustomProps {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  usersMap: IUsersMap;
  userRole: string;
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
  selectedLanguage?: string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, formatMessage } = props;

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
        component={TextInput}
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
        options={getDropdownOptions(props.citiesMap, 'name')}
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[isRequired]}
          label={formatMessage({ id: 'admin.common_fields.user'})}
          data={props.usersMap}
          options={getDropdownOptions(props.usersMap, 'name')}
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minTypesCount, maxTypesCount]}
        label={formatMessage({ id: 'admin.common_fields.types'})}
        options={getDropdownOptions(props.typesMap, 'name')}
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

export const MainInfoForm = reduxForm<{}, ICustomProps>({ form: MAIN_INFO_FORM_NAME })(Form);
