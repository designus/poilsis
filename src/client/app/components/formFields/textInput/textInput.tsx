import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { debounce } from 'lodash';

import { usePrevious } from 'client-utils/customHooks';

import { LANGUAGES, DEFAULT_LANGUAGE, hasLocalizedFields } from 'global-utils';
import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {
  hasIntl: boolean;
  selectedLanguage: string;
  multiline: boolean;
}

const getInitialValue = (value, isIntl: boolean) => {
  if (isIntl) {
    const isLocalized = hasLocalizedFields(value);
    return LANGUAGES.reduce((acc, lang) => {
      // tslint:disable-next-line
      if (isLocalized) {
        acc[lang] = value[lang] || '';
      } else {
        acc[lang] = DEFAULT_LANGUAGE === lang ? value : '';
      }
      return acc;
    }, {});
  }

  return value;
};

const { useState, useEffect, useCallback } = React;

function TextInput(props: ITextInputProps) {
  const { hasIntl, input, meta, selectedLanguage, classes, label, multiline } = props;
  const [initialState] = useState(getInitialValue(input.value, hasIntl));
  const [inputValue, setInputValue] = useState(initialState);

  const prevInputValue = usePrevious(input.value);

  useEffect(() => {
    if (input.value !== prevInputValue) {
      setInputValue(getInitialValue(input.value, hasIntl));
    }
  }, [input.value, hasIntl]);

  const onChange = useCallback(
    debounce(input.onChange, 600), [input.onChange]
  );

  const getNewState = (locale: string, newValue: string) => {
    const oldValue = inputValue;
    return hasIntl ? { ...oldValue, [locale]: newValue } : newValue;
  };

  const handleOnChange = (locale: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = getNewState(locale, event.target.value);
    setInputValue(newState);
    onChange(newState);
  };

  const handleOnBlur = (locale: string) => (event) => {
    const newState = getNewState(locale, event.target.value);
    if (newState[locale] && newState[locale] !== initialState[locale]) {
      input.onBlur(newState);
    }
  };

  const showError = (language: string) => {
    const hasError = Boolean(meta.touched && meta.invalid && meta.error);
    if (language) {
      return hasError && selectedLanguage === DEFAULT_LANGUAGE && language === DEFAULT_LANGUAGE;
    }
    return hasError;
  };

  const renderLoader = () => meta.asyncValidating && (
    <InputAdornment position="end">
      <CircularProgress size={15} />
    </InputAdornment>
  );

  const renderInput = (value: string, language?: string) => {
    return (
      <div
        className={`${classes.wrapper} ${language !== selectedLanguage ? classes.hidden : ''}`}
        key={language}
      >
        <Tooltip open={showError(language)} title={meta.error || ''} placement="right-end">
          <FormControl
            className={`${classes.formControl} ${multiline ? classes.multiline : ''}`}
            error={showError(language)}
          >
            <InputLabel htmlFor={label}>
              {label}
            </InputLabel>
            <Input
              id={label}
              value={value}
              multiline={multiline}
              rows={4}
              onBlur={handleOnBlur(language)}
              onChange={handleOnChange(language)}
              margin="dense"
              className={`${multiline ? classes.multilineInput : ''}`}
              classes={{
                error: classes.error
              }}
              endAdornment={renderLoader()}
            />
          </FormControl>
        </Tooltip>
      </div>
    );
  };

  const renderIntlInputs = () => LANGUAGES.map(lang => renderInput(inputValue[lang], lang));

  return (
    <React.Fragment>
      {hasIntl ? renderIntlInputs() : renderInput(inputValue)}
    </React.Fragment>
  );
}

export default withStyles(styles)(TextInput) as any;
