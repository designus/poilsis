import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { TextInput, Button } from 'components';

export const ITEM_DESCRIPTION_FORM_NAME = 'ItemDescriptionForm';

interface ICustomProps {
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
  selectedLanguage?: string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, formatMessage } = props;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="description"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.description'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="metaTitle"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.meta_title'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="metaDescription"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.meta_description'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="metaKeywords"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.meta_keywords'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <div>
        <Button type="submit" disabled={submitting || pristine}>
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const MainInfoForm = reduxForm<{}, ICustomProps>({ form: ITEM_DESCRIPTION_FORM_NAME  })(Form);
