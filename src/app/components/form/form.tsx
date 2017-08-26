import * as React from 'react';
import { getValidationErrors, IGenericFormState, voidFn, IFormProps } from '../../helpers';
import * as autoBind from 'react-autobind';

export function extendWithForm<T extends IFormProps>(
	WrappedComponent: React.ComponentClass<T> | React.StatelessComponent<T>,
): React.ComponentClass<T> {

	return class extends React.Component<T, {}> {

		state: IGenericFormState<object> = this.props.initialState;
		onSaveState = this.props.onSaveState || voidFn;

		constructor(props) {
			super(props);
			autoBind(this);
		}

		componentWillReceiveProps(nextProps) {
			if (this.props.initialState !== nextProps.initialState) {
				this.setState(nextProps.initialState);
			}
		}

		componentDidMount() {
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
			this.onSaveState(this.state);
		}

		handleSubmit(e) {
			e.preventDefault();
			if (this.isFormValid(this.state.errors)) {
				this.onSaveState(this.state);
				this.props.onItemSubmit(this.state.fields);
			} else {
				this.setState({showErrors: true});
				this.onSaveState({...this.state, showErrors: true});
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
