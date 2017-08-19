import * as React from 'react';
import * as autoBind from 'react-autobind';
import * as Validators from '../../helpers/validation/validators';

import {
	CheckboxGroup,
	getCheckboxOptions,
	SelectBox,
	getSelectOptions,
	TextInput,
} from '../../components';

import {
	FIELD_VALUES,
	VALIDATION_ERRORS,
	SHOW_VALIDATION_ERRORS,
	INewItemFields,
	INewItemState,
	NewItemErrorsType,
} from '../../reducers/newItem';
import { getValidationErrors, getKeyMap, IKeyMap } from '../../helpers';

import Button from 'material-ui/Button';

import {
	NAME_LABEL,
	CITY_LABEL,
	TYPES_LABEL,
	ADDRESS_LABEL,
	DESCRIPTION_LABEL,
	SEND_LABEL,
	NAME_KEY,
	CITY_KEY,
	TYPES_KEY,
	ADDRESS_KEY,
} from '../../data-strings';

export type TNewItemModel<T> = {
	[I in keyof T]: IKeyMap
};

export type NewItemModelType = TNewItemModel<INewItemFields>;

export const newItemModel: NewItemModelType = {
	name: getKeyMap('', NAME_LABEL, [Validators.required, Validators.minLength(6)]),
	city: getKeyMap('', CITY_LABEL, [Validators.required]),
	types: getKeyMap([], TYPES_LABEL, [Validators.required, Validators.minLength(1, true), Validators.maxLength(3, true)]),
	address: getKeyMap('', ADDRESS_LABEL, [Validators.required]),
	description: getKeyMap('', DESCRIPTION_LABEL, []),
};

export class AddItemForm extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);

		this.state = this.props.initialState;

	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.initialState);
	}

	componentWillMount() {
		this.setState({[VALIDATION_ERRORS]: getValidationErrors(this.state[FIELD_VALUES], newItemModel)});
	}

	getNewState(name: string, value: string): INewItemState {
		const fieldValues: INewItemFields = {...this.state[FIELD_VALUES], [name]: value };

		return {
			...this.state,
			[FIELD_VALUES]: fieldValues,
			[VALIDATION_ERRORS]: getValidationErrors(fieldValues, newItemModel),
		};

	}

	handleInputChange = (name: string) => (e, i, val) => {
		const value = val ? val : e.target.value;
		const newState = this.getNewState(name, value);
		this.setState(newState);
	}

	handleCheckboxToggle = key => id => e => {
		const target = e.target;
		const checked = this.state[FIELD_VALUES][key];

		if (target.checked) {
			checked.push(id);
		} else {
			checked.splice(checked.indexOf(id), 1);
		}

		const newState = this.getNewState(key, checked);
		this.setState(newState);

	}

	isFormValid(errors: NewItemErrorsType): boolean {
		return Object.keys(errors).filter((key: string) => errors[key].length).length === 0;
	}

	handleOnBlur() {
		this.props.onSaveState(this.state);
	}

	handleSubmit(e) {
		e.preventDefault();

		if (this.isFormValid(this.state[VALIDATION_ERRORS])) {
			this.props.onSaveState(this.state);
			this.props.onItemSubmit(this.state[FIELD_VALUES]);
		} else {
			this.props.onSaveState({
				...this.state,
				[SHOW_VALIDATION_ERRORS]: true,
			});
		}
	}

	getErrorUnderlineStyle(showErrors: boolean, errors: string[]) {
		return showErrors && errors.length > 0 ? {borderColor: 'red'} : null;
	}

	render() {

		const showErrors = this.state[SHOW_VALIDATION_ERRORS];
		const fieldValues = this.state[FIELD_VALUES];
		const errors = this.state[VALIDATION_ERRORS];

		return (
			<form onSubmit={this.handleSubmit}>
				<TextInput
					label={NAME_LABEL}
					value={fieldValues[NAME_KEY]}
					showErrors={showErrors}
					errors={errors[NAME_KEY]}
					onChange={this.handleInputChange(NAME_KEY)}
					onBlur={this.handleOnBlur}
				/>
				<SelectBox
					label={CITY_LABEL}
					value={fieldValues[CITY_KEY]}
					onChange={this.handleInputChange(CITY_KEY)}
					showErrors={showErrors}
					errors={errors[CITY_KEY]}
					options={getSelectOptions(this.props.citiesMap)}
				/>
				<CheckboxGroup
					label={TYPES_LABEL}
					showErrors={showErrors}
					errors={errors[TYPES_KEY]}
					options={getCheckboxOptions(this.props.typesMap, this.handleCheckboxToggle(TYPES_KEY), fieldValues[TYPES_KEY])}
				/>
				<TextInput
					label={ADDRESS_LABEL}
					value={fieldValues[ADDRESS_KEY]}
					showErrors={showErrors}
					errors={errors[ADDRESS_KEY]}
					onChange={this.handleInputChange(ADDRESS_KEY)}
					onBlur={this.handleOnBlur}
				/>		
				<Button
					raised
					color="primary"
					type="submit"
					label={SEND_LABEL}
					style={{marginTop: 12, marginBottom: 20, display: 'block'}}
				>
					Submit
				</Button>
			</form>
		);
	}
};
