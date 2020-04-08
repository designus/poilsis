import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { IntlShape, FormattedMessage } from 'react-intl';
import { Button } from 'components/button';
import { isRequired } from 'global-utils/inputValidators';
import { TextInput } from 'components/formFields/textInput';
import { PasswordInput } from 'components/formFields/passwordInput';
import { Credentials } from 'types/auth';

const SIGN_IN_FORM = 'SignInForm';

type CustomProps = {
  intl: IntlShape;
};

type Props = CustomProps & InjectedFormProps<Credentials, CustomProps>;

const Form = (props: Props)  => {
  const { handleSubmit, error, submitting, pristine, intl } = props;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="username"
        type="text"
        validate={[isRequired]}
        component={TextInput}
        label={intl.formatMessage({
          id: 'common.username',
          defaultMessage: 'Username'
        })}
      />
      <Field
        name="password"
        type="password"
        validate={[isRequired]}
        component={PasswordInput}
        label={intl.formatMessage({
          id: 'common.password',
          defaultMessage: 'Password'
        })}
      />
      {error && <strong>{error}</strong>}
      <Button disabled={submitting} type="submit">
        <FormattedMessage id="client.log_in" defaultMessage="Log in" />
      </Button>
    </form>
  );
};

export default reduxForm<Credentials, CustomProps>({
  form: SIGN_IN_FORM
})(Form);
