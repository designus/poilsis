import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { TextInput, Button } from 'components';
import { isRequired } from 'global-utils';

export const TYPE_FORM_NAME = 'TypeForm';

interface ICustomProps {
  selectedLanguage?: string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>) => {
  const { handleSubmit, selectedLanguage } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label="Name"
        selectedLanguage={selectedLanguage}
        intl
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label="Alias"
        selectedLanguage={selectedLanguage}
        intl
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label="Description"
        selectedLanguage={selectedLanguage}
        intl
      />
      <div>
        <Button type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export const TypeForm = reduxForm<{}, ICustomProps>({ form: TYPE_FORM_NAME })(Form);
