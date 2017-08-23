import * as React from 'react';
import { getValidationErrors, IGenericFormState } from '../../helpers';
import * as autoBind from 'react-autobind';

export const extendWithForm = (WrappedComponent) => {

	return class extends React.Component<any, any> {

		state: IGenericFormState<object> = this.props.initialState;

		constructor(props) {
			super(props);
			autoBind(this);
		}

		componentWillReceiveProps(nextProps) {
			this.setState(nextProps.initialState);
		}

		componentWillMount() {
			this.setState({errors: getValidationErrors(this.state.fields, this.state.model)});
		}

		getNewState(name: string, value: string): IGenericFormState<object> {
			const fieldValues = {...this.state.fields, [name]: value };

			return {
				...this.state,
				fields: fieldValues,
				errors: getValidationErrors(fieldValues, this.state.model),
			};

		}

		handleInputChange = (name: string) => (e, i, val) => {
			const value = val ? val : e.target.value;
			const newState = this.getNewState(name, value);
			this.setState(newState);
		}

		handleCheckboxToggle = key => id => e => {
			const target = e.target;
			const checked = this.state.fields[key];

			if (target.checked) {
				checked.push(id);
			} else {
				checked.splice(checked.indexOf(id), 1);
			}

			const newState = this.getNewState(key, checked);
			this.setState(newState);

		}

		isFormValid(errors): boolean {
			return Object.keys(errors).filter((key: string) => errors[key].length).length === 0;
		}

		handleOnBlur() {
			this.props.onSaveState(this.state);
		}

		handleSubmit(e) {
			e.preventDefault();

			if (this.isFormValid(this.state.errors)) {
				this.props.onSaveState(this.state);
				this.props.onItemSubmit(this.state.fields);
			} else {
				this.props.onSaveState({
					...this.state,
					showErrors: true,
				});
			}
		}

		render() {
			return (
				<WrappedComponent
					handleCheckboxToggle={this.handleCheckboxToggle}
					handleSubmit={this.handleSubmit}
					handleOnBlur={this.handleOnBlur}
					handleInputChange={this.handleInputChange}
					state={this.state}
					{...this.props}
				/>
			);
		}
	};
};
