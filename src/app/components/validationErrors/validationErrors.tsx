import * as React from 'react';
import styled from 'styled-components';

const ErrorsWrapper = styled.ul`
  margin: 0;
  padding: ${(props: any) => props.padding};
  color: red;
  font-style: italic;
` as any;

const Li = styled.li`
  list-style: none;
`;

export interface IValidationErrors {
  showErrors: boolean;
  errors: string[];
  padding?: string;
}

export const ValidationErrors = ({showErrors, errors, padding = '10px 0'}: IValidationErrors) => {

  if (showErrors && errors.length > 0) {
    return (
      <ErrorsWrapper padding={padding}>
        {errors.map((error, i) => (<Li key={i}>{error}</Li>))}
      </ErrorsWrapper>
    );
  } else {
    return null;
  }
};
