import * as React from 'react';
import { Dispatch } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { adminRoutes } from 'client-utils/routes';
import { asyncValidateAlias } from 'actions';
import { isRequired, IType } from 'global-utils';
import { TextInput } from 'components/formFields/textInput';
import { Switcher } from 'components/formFields/switch';
import { AdminFormActions } from 'components/adminFormActions';

import { Props, ICustomProps } from './types';

export const TYPE_FORM_NAME = 'TypeForm';

const Form: React.FunctionComponent<Props> = props => {
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
      <AdminFormActions backLink={adminRoutes.types.getLink()} />
    </form>
  );
};

export const TypeForm = reduxForm<IType, ICustomProps>({
  asyncValidate: (values: IType, dispatch, props) => asyncValidateAlias(values, '/api/types/type/alias-exist', props.intl),
  asyncBlurFields: ['alias'],
  form: TYPE_FORM_NAME
})(Form);
