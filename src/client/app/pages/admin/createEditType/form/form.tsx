import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { TextInput, Button } from 'components';
import { isRequired } from 'global-utils';

const Form = (props: InjectedFormProps<{}, {}>) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label="Name"
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label="Alias"
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label="Description"
      />
      <div>
        <Button type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export const TypeForm = reduxForm<{}, any>({ form: 'TypeForm' })(Form);
