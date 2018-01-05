import * as React from 'react';
import styled from 'styled-components';
import { ERROR_COLOR } from '../../global-styles';

const ErrorsWrapper = styled.div`
  padding: ${(props: any) => props.padding};
  color: ${ERROR_COLOR};
  font-style: italic;

  & > ul {
    margin: 0;
    padding-left: 25px;
  }
` as any;

export interface IValidationErrors {
  showErrors: boolean;
  errors: string[];
  padding?: string;
  header?: string;
}

export const ValidationErrors = ({showErrors, errors, header = '', padding = '10px 0'}: IValidationErrors) => {

  if (showErrors && errors.length > 0) {
    return (
      <ErrorsWrapper padding={padding}>
        {header}
        <ul>
          {errors.map((error, i) => (<li key={i}>{error}</li>))}
        </ul>
      </ErrorsWrapper>
    );
  } else {
    return null;
  }
};
