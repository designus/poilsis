import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { asyncValidateAlias } from 'actions';
import { isRequired } from 'global-utils';
import { Button } from 'components/button';
import { TextInput } from 'components/formFields/textInput';

export const TYPE_FORM_NAME = 'TypeForm';

interface ICustomProps {
  selectedLanguage?: string;
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>) => {
  const { handleSubmit, selectedLanguage, formatMessage } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label={formatMessage({id: 'admin.common_fields.name'})}
        selectedLanguage={selectedLanguage}
        hasIntl
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label={formatMessage({id: 'admin.common_fields.alias'})}
        selectedLanguage={selectedLanguage}
        hasIntl
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label={formatMessage({id: 'admin.common_fields.description'})}
        selectedLanguage={selectedLanguage}
        hasIntl
      />
      <div>
        <Button type="submit">
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const TypeForm = reduxForm<{}, ICustomProps>({
  asyncValidate: asyncValidateAlias('/api/types/type/alias-exist'),
  asyncBlurFields: ['alias'],
  form: TYPE_FORM_NAME
})(Form);
