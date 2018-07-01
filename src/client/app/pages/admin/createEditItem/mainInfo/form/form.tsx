import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  CheckboxGroup,
  SelectBox,
  TextInput,
  // Button,
} from '../../../../../components';
import { isAdmin } from '../../../../../../../global-utils';

const required = value => value ? undefined : 'This field is required';
const maxLength = max => value => value && value.length > max ? `Field must be ${max} characters or less` : undefined;
const minLength = min => value => value && value.length < min ? `Field must be ${min} characters or more` : undefined;
// const number = value => value && isNaN(Number(value)) ? 'Field must be a number' : undefined;
// const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

const minLength3 = minLength(3);
const minLength1 = minLength(1);
const maxLength3 = maxLength(3);
const maxLength15 = maxLength(15);

const Form = props => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[required, minLength3, maxLength15]}
        label="Name"
      />
      <Field
        name="city"
        component={SelectBox}
        validate={[required]}
        label="City"
        data={props.citiesMap}
        dataKey="name"
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[required]}
          label="User"
          data={props.usersMap}
          dataKey="name"
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minLength1, maxLength3]}
        label="Types"
        data={props.typesMap}
        dataKey="name"
      />
       <Field
        name="address"
        type="text"
        component={TextInput}
        validate={[required]}
        label="Address"
      />
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
      </div>
    </form>
  );
};

export const MainInfoForm = reduxForm({ form: 'MainInfoForm' })(Form) as any;
