import * as React from 'react';
import Button from 'material-ui/Button';

import { CheckboxGroup,	SelectBox, TextInput } from '../../components';
import { ICityMap, ITypesMap } from '../../reducers';
import { IFormProps, IGenericDataMap } from '../../helpers';
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
} from '../../data-strings';

export interface IAddItemProps extends IFormProps {
  citiesMap?: IGenericDataMap<ICityMap>;
  typesMap?: IGenericDataMap<ITypesMap>;
}

export class AddItem extends React.Component<IAddItemProps, any> {

  render() {

    const {showErrors, errors, fields} = this.props.state;

    return (
      <form onSubmit={this.props.handleSubmit}>
        <TextInput
          label={NAME_LABEL}
          value={fields[NAME_KEY]}
          showErrors={showErrors}
          errors={errors[NAME_KEY]}
          onChange={this.props.handleInputChange(NAME_KEY)}
          onBlur={this.props.handleOnBlur}
        />
        <SelectBox
          label={CITY_LABEL}
          value={fields[CITY_KEY]}
          onChange={this.props.handleInputChange(CITY_KEY)}
          showErrors={showErrors}
          errors={errors[CITY_KEY]}
          data={this.props.citiesMap}
        />
        <CheckboxGroup
          label={TYPES_LABEL}
          showErrors={showErrors}
          errors={errors[TYPES_KEY]}
          onChange={this.props.handleCheckboxToggle(TYPES_KEY)}
          data={this.props.typesMap}
          checkedItems={fields[TYPES_KEY]}
        />
        <TextInput
          label={ADDRESS_LABEL}
          value={fields[ADDRESS_KEY]}
          showErrors={showErrors}
          errors={errors[ADDRESS_KEY]}
          onChange={this.props.handleInputChange(ADDRESS_KEY)}
          onBlur={this.props.handleOnBlur}
        />		
        <Button
          raised
          color="primary"
          type="submit"
          style={{marginTop: 12, marginBottom: 20, display: 'block'}}
        >
          {SEND_LABEL}
        </Button>
      </form>
    );
  }
};
