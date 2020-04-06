import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Button } from 'components/button';
import { isRequired } from 'global-utils/inputValidators';
import { TextInput } from 'components/formFields/textInput';
import { PasswordInput } from 'components/formFields/passwordInput';
import { Credentials } from 'types/auth';
export const SIGN_IN_FORM = 'SignInForm';

type CustomProps = {
  intl: IntlShape;
};

type Props = CustomProps & InjectedFormProps<Credentials, CustomProps>;

const Form = (props: Props)  => {
  const { handleSubmit, error, submitting, pristine } = props;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        label="Username"
        name="username"
        type="text"
        validate={[isRequired]}
        component={TextInput}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        validate={[isRequired]}
        component={PasswordInput}
      />
      {error && <strong>{error}</strong>}
      <Button disabled={submitting} type="submit">Log in</Button>
    </form>
  );
};

export default reduxForm<Credentials, CustomProps>({
  form: SIGN_IN_FORM
})(Form);
