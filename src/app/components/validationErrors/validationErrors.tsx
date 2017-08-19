import * as React from 'react';
import styled, { StyledFunction } from 'styled-components';

interface IErrorsWrapperProps {
	padding: string;
}

const ul: StyledFunction<IErrorsWrapperProps & React.HTMLProps<any>> = styled.ul;

const ErrorsWrapper = ul`
	margin: 0;
	padding: ${(props: IErrorsWrapperProps) => props.padding};
	color: red;
	font-style: italic;
`;

export const ValidationErrors = ({showErrors, errors, padding = '10px 0'}) => {

	if (showErrors && errors.length > 0) {
		return (
			<ErrorsWrapper padding={padding}>
				{errors.map((error, i) => (<li key={i}>{error}</li>))}
			</ErrorsWrapper>
		);
	} else {
		return null;
	}
};
