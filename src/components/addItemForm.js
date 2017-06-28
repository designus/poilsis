import React from 'react';
import {initialNewItemState, FIELD_VALUES, VALIDATION_ERRORS, SHOW_VALIDATION_ERRORS } from '../reducers/newItem';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

import * as Validators from '../helpers/validation/validators';

export const getKeyMap = (value, title, validators) => {
	return { value, title, validators }
}

export const newItemModel = {
	name: getKeyMap('', 'Pavadinimas', [Validators.required, Validators.minLength(6)]),
	city: getKeyMap('', 'Miestas', [Validators.required]),
	types: getKeyMap([], 'Tipai', [Validators.required, Validators.minLength(1)]),
	address: getKeyMap('', 'Adresas', [Validators.required]),
	description: getKeyMap('', 'Aprasymas', [])
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

		this.state = this.props.initialState;
		console.log('Initial state', this.state);
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCheckboxToggle = this.handleCheckboxToggle.bind(this);
		this.handleOnBlur = this.handleOnBlur.bind(this);
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
			this.props.onSaveState({
				...this.state,
				[SHOW_VALIDATION_ERRORS]: true
			});
		}
		
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>				
				<div>
					<TextField
						hintText="Pavadinimas"
						value={this.state[FIELD_VALUES].name}
						onChange={this.handleInputChange('name')}
						onBlur={this.handleOnBlur}
						errorText={this.state[SHOW_VALIDATION_ERRORS] && this.state[VALIDATION_ERRORS].name}
	   			/>
				</div>
				<div>
					<SelectField
						floatingLabelText="City"
						value={this.state[FIELD_VALUES].city}
						onChange={this.handleInputChange('city')}
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
				</div>
				<div>
				{Object.keys(this.props.typesMap).map(typeId => {
						const name = this.props.typesMap[typeId].name;
						return (
							<div key={typeId}>
								<Checkbox
      						label={name}
									onCheck={this.handleCheckboxToggle('types', typeId)}
									checked={this.isCheckboxChecked('types', typeId)}
								/>
							</div>
						)
				})}
				</div>
				<div>
					<TextField
      			hintText="Adresas"
						value={this.state[FIELD_VALUES].address}
 						onChange={this.handleInputChange('address')}
						onBlur={this.handleOnBlur}
	   			/>
				</div>
				
		    <RaisedButton
					type="submit"
					label="Siusti"
					primary={true} 
					style={{marginTop: 12}} 
				/>

			</form>
		)
	}
}