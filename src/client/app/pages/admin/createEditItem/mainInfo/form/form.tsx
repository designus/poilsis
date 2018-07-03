import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  CheckboxGroup,
  SelectBox,
  TextInput,
  Button,
} from '../../../../../components';
import { isAdmin } from '../../../../../../../global-utils';

const required = value => value ? undefined : 'This field is required';
const maxTextLength = max => value => value && value.length > max ? `Field must be ${max} characters or less` : undefined;
const minTextLength = min => value => value && value.length < min ? `Field must be ${min} characters or more` : undefined;
const minCheckedLength = min => value => !value || value.length < min ? `Please select at least ${min} options` : undefined;
const maxCheckedLength = max => value => !value || value.length > max ? `Please select no more than ${max} options` : undefined;
// const number = value => value && isNaN(Number(value)) ? 'Field must be a number' : undefined;
// const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

const Form = props => {
  const { handleSubmit, submitting } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[required, minTextLength(3), maxTextLength(15)]}
        label="Name"
      />
      <Field
        name="address"
        type="text"
        component={TextInput}
        validate={[required]}
        label="Address"
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
        validate={[minCheckedLength(1), maxCheckedLength(3)]}
        label="Types"
        data={props.typesMap}
        dataKey="name"
      />
      <div>
        <Button type="submit" disabled={submitting}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default reduxForm({ form: 'MainInfoForm' })(Form) as any;
