import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Button } from 'components/button';
import { getDropdownOptions } from 'client-utils/methods';
import { isRequired } from 'global-utils';
import { ITypesMap } from 'types';

import { TextInput } from 'components/formFields/textInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';

export const CITY_FORM_NAME = 'CityForm';

interface ICustomProps {
  typesMap: ITypesMap;
  locale: string;
  selectedLanguage?: string;
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>) => {
  const { handleSubmit, selectedLanguage, formatMessage, locale } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label={formatMessage({ id: 'admin.common_fields.name' })}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        intl
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.alias' })}
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="types"
        component={CheckboxGroup}
        label={formatMessage({ id: 'admin.common_fields.types' })}
        options={getDropdownOptions(props.typesMap, 'name', locale)}
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.description' })}
        intl
        selectedLanguage={selectedLanguage}
      />
      <div>
        <Button type="submit">
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const CityForm = reduxForm<{}, ICustomProps>({ form: CITY_FORM_NAME })(Form);
