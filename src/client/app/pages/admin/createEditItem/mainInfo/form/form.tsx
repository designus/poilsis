import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { CheckboxGroup, SelectBox, TextInput, Button, Switcher } from 'components';
import { isRequired, minTextLength, maxTextLength, minCheckedLength, maxCheckedLength, isAdmin } from 'global-utils';
import { ICitiesMap, ITypesMap, IUsersMap } from 'reducers';

const minTextLength3 = minTextLength(3);
const maxTextLength15 = maxTextLength(15);
const minCheckedLength1 = minCheckedLength(1);
const maxCheckedLength3 = maxCheckedLength(3);

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
        validate={[isRequired, minTextLength3, maxTextLength15]}
        label={formatMessage({ id: 'admin.common_fields.name'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.alias'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="address"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.address'})}
      />
      <Field
        name="cityId"
        component={SelectBox}
        validate={[isRequired]}
        label={formatMessage({ id: 'admin.common_fields.city'})}
        // TODO: pass cities array directly
        data={props.citiesMap}
        dataKey="name"
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[isRequired]}
          label={formatMessage({ id: 'admin.common_fields.user'})}
          data={props.usersMap}
          dataKey="name"
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minCheckedLength1, maxCheckedLength3]}
        label={formatMessage({ id: 'admin.common_fields.types'})}
        data={props.typesMap}
        dataKey="name"
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
