import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Button } from 'components/button';
import { TextInput } from 'components/formFields/textInput';
import { Credentials } from 'types/auth';
export const SIGN_IN_FORM = 'SignInForm';

const Form = (props: InjectedFormProps<Credentials>)  => {
  const { handleSubmit, error, submitting, pristine } = props;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="username"
        type="text"
        component={TextInput}
        label="Username"
      />
      <Field
        name="password"
        type="password"
        component={TextInput}
        label="Password"
      />
      {error && <strong>{error}</strong>}
      <Button disabled={submitting} type="submit">Log in</Button>
    </form>
  );
};

export default reduxForm<Credentials>({
  form: SIGN_IN_FORM
})(Form);
