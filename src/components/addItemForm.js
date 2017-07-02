import React from 'react';
import autoBind from 'react-autobind';

import { ValidationErrors } from './validationErrors';
import { TextInput } from './textInput';
import { SelectBox, getSelectOptions } from './selectBox';
import { CheckboxGroup, getCheckboxOptions } from './checkboxGroup';

import {initialNewItemState, FIELD_VALUES, VALIDATION_ERRORS, SHOW_VALIDATION_ERRORS } from '../reducers/newItem';
import RaisedButton from 'material-ui/RaisedButton';

import * as Validators from '../helpers/validation/validators';

import {getValidationErrors} from '../helpers/validation/methods';

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
	DESCRIPTION_KEY
} from '../data-strings';

export const getKeyMap = (value, title, validators) => {
	return { value, title, validators }
}

export const newItemModel = {
	[NAME_KEY]: getKeyMap('', NAME_LABEL, [Validators.required, Validators.minLength(6)]),
	[CITY_KEY]: getKeyMap('', CITY_LABEL, [Validators.required]),
	[TYPES_KEY]: getKeyMap([], TYPES_LABEL, [Validators.required, Validators.minLength(1, true), Validators.maxLength(3, true)]),
	[ADDRESS_KEY]: getKeyMap('', ADDRESS_LABEL, [Validators.required]),
	[DESCRIPTION_KEY]: getKeyMap('', DESCRIPTION_LABEL, [])
}

export default class AddItemForm extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);

		this.state = this.props.initialState;
		console.log('Initial state', this.state);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.initialState);
	}

	componentWillMount() {
		this.setState({[VALIDATION_ERRORS]: getValidationErrors(this.state[FIELD_VALUES])});
	}

	getNewState(name, value) {
		const fieldValues = {...this.state[FIELD_VALUES], [name]: value }

		return {
			...this.state, 
			[FIELD_VALUES]: fieldValues,
			[VALIDATION_ERRORS]: getValidationErrors(fieldValues)
		}

	}

	handleInputChange = (name) => (e, i, val) => {
		const value = val ? val : e.target.value;
		const newState = this.getNewState(name, value);
		this.setState(newState);
	}

	handleCheckboxToggle = key => id => e => {
		const target = e.target;
		let checked = this.state[FIELD_VALUES][key];

		if (target.checked) {
			checked.push(id)
		} else {
			checked.splice(checked.indexOf(id), 1);
		}

		const newState = this.getNewState(key, checked);
		this.setState(newState);

	}	

	isFormValid(errors) {
		return Object.keys(errors).filter(key => errors[key].length).length === 0;
	}

	handleOnBlur() {
		this.props.onSaveState(this.state);
	}

	handleSubmit(e) {
		e.preventDefault();
		console.log('Submit state', this.state);
		if (this.isFormValid(this.state[VALIDATION_ERRORS])) {
			this.props.onSaveState(this.state);
			this.props.onItemSubmit(this.state[FIELD_VALUES]);
		} else {
			this.props.onSaveState({
				...this.state,
				[SHOW_VALIDATION_ERRORS]: true
			});
		}
		
	}

	getErrorUnderlineStyle(showErrors, errors) {
		return showErrors && errors.length > 0 ? {borderColor: 'red'} : null
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
					underlineStyle={this.getErrorUnderlineStyle(showErrors, errors[NAME_KEY])}
					showErrors={showErrors}
					errors={errors[NAME_KEY]}
					onChange={this.handleInputChange(NAME_KEY)}
					onBlur={this.handleOnBlur}
				/>
				<SelectBox
					label={CITY_LABEL}
					value={fieldValues[CITY_KEY]}
					onChange={this.handleInputChange(CITY_KEY)}
					underlineStyle={this.getErrorUnderlineStyle(showErrors, errors[CITY_KEY])}
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
					underlineStyle={this.getErrorUnderlineStyle(showErrors, errors[ADDRESS_KEY])}
					showErrors={showErrors}
					errors={errors[ADDRESS_KEY]}
					onChange={this.handleInputChange(ADDRESS_KEY)}
					onBlur={this.handleOnBlur}
				/>		
		    <RaisedButton
					type="submit"
					label={SEND_LABEL}
					primary={true} 
					style={{marginTop: 12}} 
				/>

			</form>
		)
	}
}