import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { CheckboxGroup, SelectBox, TextInput, Button } from 'components';
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
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>)  => {
  const { handleSubmit, submitting, pristine } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired, minTextLength3, maxTextLength15]}
        label="Name"
      />
      <Field
        name="address"
        type="text"
        component={TextInput}
        label="Address"
      />
      <Field
        name="cityId"
        component={SelectBox}
        validate={[isRequired]}
        label="City"
        data={props.citiesMap}
        dataKey="name"
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[isRequired]}
          label="User"
          data={props.usersMap}
          dataKey="name"
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minCheckedLength1, maxCheckedLength3]}
        label="Types"
        data={props.typesMap}
        dataKey="name"
      />
      <div>
        <Button type="submit" disabled={submitting || pristine}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export const MainInfoForm = reduxForm<{}, ICustomProps>({ form: MAIN_INFO_FORM_NAME })(Form);
