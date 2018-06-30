import * as React from 'react';
import Button from '@material-ui/core/Button';
import { CheckboxGroup,	SelectBox, TextInput } from '../../../../components';
import { ICity, ITypesMap, IItemsMap, IUser } from '../../../../reducers';
import { IFormProps, IGenericDataMap, IGenericFormState } from '../../../../client-utils';
import {
  NAME_LABEL,
  CITY_LABEL,
  TYPES_LABEL,
  ADDRESS_LABEL,
  SEND_LABEL,
  NAME_KEY,
  CITY_KEY,
  TYPES_KEY,
  ADDRESS_KEY,
} from '../../../../../../data-strings';

export interface IAddItemProps extends IFormProps {
  citiesMap?: IGenericDataMap<ICity>;
  typesMap?: IGenericDataMap<ITypesMap>;
  usersMap?: IGenericDataMap<IUser>;
  userRole?: string;
  state?: IGenericFormState<IItemsMap>;
  uploadImages?: (itemId: string, files: any[]) => Promise<any>;
  isCreate?: boolean;
  handleSubmit?: any;
}

export const CreateItem = (props: IAddItemProps) => {
  const {showErrors, errors, fields} = props.state;
  return (
    <form onSubmit={props.handleSubmit}>
      <TextInput
        label={NAME_LABEL}
        value={fields[NAME_KEY]}
        showErrors={showErrors}
        errors={errors[NAME_KEY]}
        onChange={props.handleInputChange(NAME_KEY)}
        onBlur={props.handleOnBlur}
      />
      <SelectBox
        label={CITY_LABEL}
        value={fields[CITY_KEY]}
        onChange={props.handleInputChange(CITY_KEY)}
        showErrors={showErrors}
        errors={errors[CITY_KEY]}
        data={props.citiesMap}
      />
      <CheckboxGroup
        label={TYPES_LABEL}
        showErrors={showErrors}
        errors={errors[TYPES_KEY]}
        onChange={props.handleCheckboxToggle(TYPES_KEY)}
        data={props.typesMap}
        checkedItems={fields[TYPES_KEY]}
      />
      <TextInput
        label={ADDRESS_LABEL}
        value={fields[ADDRESS_KEY]}
        showErrors={showErrors}
        errors={errors[ADDRESS_KEY]}
        onChange={props.handleInputChange(ADDRESS_KEY)}
        onBlur={props.handleOnBlur}
      />
      <Button
        color="primary"
        type="submit"
        style={{marginTop: 12, marginBottom: 20, display: 'block'}}
      >
        {SEND_LABEL}
      </Button>
    </form>
  );
};
