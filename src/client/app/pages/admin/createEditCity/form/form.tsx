import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { TextInput, CheckboxGroup, Button } from 'components';
import { isRequired } from 'global-utils';
import { ITypesMap } from 'reducers';

export const CITY_FORM_NAME = 'CityForm';

interface ICustomProps {
  typesMap: ITypesMap;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[isRequired]}
        label="Name"
        intl
      />
      <Field
        name="alias"
        type="text"
        component={TextInput}
        label="Alias"
        intl
      />
      <Field
        name="types"
        component={CheckboxGroup}
        label="Types"
        data={props.typesMap}
        dataKey="name"
      />
      <Field
        name="description"
        type="text"
        component={TextInput}
        label="Description"
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

export const CityForm = reduxForm<{}, ICustomProps>({ form: CITY_FORM_NAME })(Form);
