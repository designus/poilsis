import * as React from 'react';
import { Dispatch } from 'react-redux';
import { Field, reduxForm, InjectedFormProps, ConfigProps } from 'redux-form';
import { FormattedMessage, InjectedIntl } from 'react-intl';

import { asyncValidateAlias } from 'actions';
import { isRequired, IType } from 'global-utils';
import { Button } from 'components/button';
import { TextInput } from 'components/formFields/textInput';
import { Switcher } from 'components/formFields/switch';

export const TYPE_FORM_NAME = 'TypeForm';

interface ICustomProps {
  selectedLanguage?: string;
  intl: InjectedIntl;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>) => {
  const { handleSubmit, selectedLanguage, intl } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label={intl.formatMessage({id: 'admin.common_fields.name'})}
        selectedLanguage={selectedLanguage}
        hasIntl
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label={intl.formatMessage({id: 'admin.common_fields.alias'})}
        selectedLanguage={selectedLanguage}
        hasIntl
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label={intl.formatMessage({id: 'admin.common_fields.description'})}
        selectedLanguage={selectedLanguage}
        hasIntl
      />
      <Field
        name="isEnabled"
        component={Switcher}
        selectedLanguage={selectedLanguage}
        hasIntl
        label={intl.formatMessage({ id: 'admin.common_fields.is_enabled'})}
      />
      <div>
        <Button type="submit">
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const TypeForm = reduxForm<IType, ICustomProps>({
  asyncValidate: (values: IType, dispatch: Dispatch<any>, props) => {
    return asyncValidateAlias(values, '/api/types/type/alias-exist', props.intl);
  },
  asyncBlurFields: ['alias'],
  form: TYPE_FORM_NAME
})(Form);
