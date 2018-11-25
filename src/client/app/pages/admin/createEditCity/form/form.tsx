import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextInput, CheckboxGroup, Button } from 'components';
import { isRequired } from 'global-utils';
import { ITypesMap } from 'reducers';

export const CITY_FORM_NAME = 'CityForm';

interface ICustomProps {
  typesMap: ITypesMap;
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
        label={formatMessage({ id: 'admin.common_fields.name' })}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.alias' })}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="types"
        component={CheckboxGroup}
        label={formatMessage({ id: 'admin.common_fields.types' })}
        data={props.typesMap}
        dataKey="name"
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
