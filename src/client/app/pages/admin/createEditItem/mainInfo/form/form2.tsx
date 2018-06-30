import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  // CheckboxGroup,
  // SelectBox,
  TextInput,
  // Button,
} from '../../../../../components';

const required = value => value ? undefined : 'This field is required';
const maxLength = max => value => value && value.length > max ? `Field must be ${max} characters or less` : undefined;
const minLength = min => value => value && value.length < min ? `Field must be ${min} characters or more` : undefined;
// const number = value => value && isNaN(Number(value)) ? 'Field must be a number' : undefined;
// const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

const minLength3 = minLength(3);
const maxLength15 = maxLength(15);

const MainInfoForm = props => {
  const { handleSubmit, pristine, submitting } = props;
  console.log('Main info props', props);
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div>
        <Field
          name="name"
          type="text"
          component={TextInput}
          validate={[required, minLength3, maxLength15]}
          label="Name"
        />
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
        <button type="button" disabled={pristine || submitting}>
          Clear Values
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'MainInfoForm',
})(MainInfoForm) as any;
