import * as React from 'react';
import styled from 'styled-components';
import { ERROR_COLOR } from '../../global-styles';

const ErrorsWrapper = styled.ul`
  margin: 0;
  padding: ${(props: any) => props.padding};
  color: ${ERROR_COLOR};
  font-style: italic;
  & > li {
    list-style: none;
  }
` as any;

export interface IValidationErrors {
  showErrors: boolean;
  errors: string[];
  padding?: string;
}

export const ValidationErrors = ({showErrors, errors, padding = '10px 0'}: IValidationErrors) => {

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
