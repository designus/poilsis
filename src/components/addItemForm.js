import React from 'react';
import autoBind from 'react-autobind';

import { ValidationErrors } from './validationErrors';
import {initialNewItemState, FIELD_VALUES, VALIDATION_ERRORS, SHOW_VALIDATION_ERRORS } from '../reducers/newItem';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

import * as Validators from '../helpers/validation/validators';
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

export const getValidationErrors = (state, model = newItemModel) => {
	return Object.keys(model).reduce((errors, key) => {
		const keyModel = model[key];
		const validationMsg = keyModel.validators.reduce((acc, errorMessageFn) => {
			const getErrorMsg = errorMessageFn(state[key], state);
			return getErrorMsg 
				? [...acc, getErrorMsg(keyModel.title)] 
				: [...acc];
		}, [])

		return {...errors, [key]: validationMsg};

	}, {})
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

	handleCheckboxToggle = (name, id) => (e) => {
		const target = e.target;
		let checked = this.state[FIELD_VALUES][name];

		if (target.checked) {
			checked.push(id)
		} else {
			checked.splice(checked.indexOf(id), 1);
		}

		const newState = this.getNewState(name, checked);
		this.setState(newState);

	}	

	isCheckboxChecked(name, id) {
		return this.state[FIELD_VALUES][name].indexOf(id) > -1;
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
			console.log('Form not valid');
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
				<div>
					<TextField
						floatingLabelText={NAME_LABEL}
						hintText={NAME_LABEL}
						value={fieldValues[NAME_KEY]}
						onChange={this.handleInputChange(NAME_KEY)}
						onBlur={this.handleOnBlur}
						underlineStyle={this.getErrorUnderlineStyle(showErrors, errors[NAME_KEY])}
	   			/>
					<ValidationErrors 
						showErrors={showErrors}
						errors={errors[NAME_KEY]}
					/>
				</div>
				<div>
					<SelectField
						floatingLabelText={CITY_LABEL}
						value={fieldValues[CITY_KEY]}
						onChange={this.handleInputChange(CITY_KEY)}
						underlineStyle={this.getErrorUnderlineStyle(showErrors, errors[CITY_KEY])}
					>
						{
							Object.keys(this.props.citiesMap).map((cityId, i) => {
								return (
									<MenuItem 
										value={cityId} 
										key={i} 
										primaryText={this.props.citiesMap[cityId].name} 
									/>
								)
							})
						}
					</SelectField>
					<ValidationErrors 
						showErrors={showErrors}
						errors={errors[CITY_KEY]}
					/>
				</div>
				<div>
					<br />
					<div>Types</div>
					<br />
					{Object.keys(this.props.typesMap).map(typeId => {
							const name = this.props.typesMap[typeId].name;
							return (
								<div key={typeId}>
									<Checkbox
										label={name}
										onCheck={this.handleCheckboxToggle(TYPES_KEY, typeId)}
										checked={this.isCheckboxChecked(TYPES_KEY, typeId)}
									/>
								</div>
							)
					})}
					<br />
					<ValidationErrors 
						showErrors={showErrors}
						errors={errors[TYPES_KEY]}
					/>
				</div>
				<div>
					<TextField
						floatingLabelText={ADDRESS_LABEL}
						hintText={ADDRESS_LABEL}
						value={fieldValues[ADDRESS_KEY]}
 						onChange={this.handleInputChange(ADDRESS_KEY)}
						onBlur={this.handleOnBlur}
						underlineStyle={this.getErrorUnderlineStyle(showErrors, errors[ADDRESS_KEY])}
	   			/>
					<ValidationErrors 
						showErrors={showErrors}
						errors={errors[ADDRESS_KEY]}
					/>
				</div>
				
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