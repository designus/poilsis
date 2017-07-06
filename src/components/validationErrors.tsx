import * as React from 'react';

export const ValidationErrors = ({showErrors, errors}) => {
  
  if (showErrors && errors.length > 0) {
    return (
      <ul style={{margin: 0, padding: 0, color: 'red'}}>
        {errors.map((error, i) => {
          return (
            <li key={i}>{error}</li>
          )
        })}
      </ul>
    )
  } else {
    return null
  }
}