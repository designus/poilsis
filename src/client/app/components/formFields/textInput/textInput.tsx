import React, { useState, useEffect, useCallback } from 'react';
import { WrappedFieldProps } from 'redux-form';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { debounce } from 'lodash';

import { usePrevious } from 'client-utils/customHooks';
import { isInputHidden } from 'client-utils/methods';

import { LANGUAGES, DEFAULT_LANGUAGE, hasLocalizedFields, TranslatableField, Locale } from 'global-utils';
import { useStyles } from './styles';

export interface ITextInputProps extends WrappedFieldProps {
  hasIntl: boolean;
  selectedLanguage: Locale;
  isHidden: string;
  multiline: boolean;
}

const getInitialValue = (value: string | TranslatableField, isIntl: boolean) => {
  if (isIntl) {
    return LANGUAGES.reduce<TranslatableField>((acc, locale) => {
      if (hasLocalizedFields(value)) {
        acc[locale] = value[locale] || '';
      } else {
        acc[locale] = DEFAULT_LANGUAGE === locale ? value : '';
      }
      return acc;
    }, {} as TranslatableField);
  }

  return value;
};

function TextInput(props: ITextInputProps) {
  const { hasIntl, input, meta, selectedLanguage, label, multiline } = props;
  const classes = useStyles();
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

  const getNewState = (newValue: string, locale?: Locale) => {
    const oldValue = inputValue;

    if (locale && hasIntl && hasLocalizedFields(oldValue)) {
      return { ...oldValue, [locale]: newValue };
    }

    return newValue;
  };

  const handleOnChange = (locale?: Locale) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = getNewState(event.target.value, locale);
    setInputValue(newState);
    onChange(newState);
  };

  const handleOnBlur = (locale?: Locale) => (event: any) => {
    const newState = getNewState(event.target.value, locale);
    if (hasIntl && locale && (newState as TranslatableField)[locale] !== (initialState as TranslatableField)[locale]) {
      input.onBlur(newState);
    }
  };

  const showError = (error: string | TranslatableField, language?: Locale) => {
    if (typeof error === 'string') {
      const hasError = Boolean(meta.touched && meta.invalid && error);
      if (language) {
        // Show error only on main language tab
        return hasError && selectedLanguage === DEFAULT_LANGUAGE && language === DEFAULT_LANGUAGE;
      }
      return hasError;
    }

    return Boolean(meta.touched && meta.invalid && error[language as Locale] && language === selectedLanguage);
  };

  const renderLoader = () => meta.asyncValidating && (
    <InputAdornment position="end">
      <CircularProgress size={15} />
    </InputAdornment>
  );

  const getError = (error: string | TranslatableField) => {
    if (typeof error === 'string') {
      return error;
    } else if (hasLocalizedFields(error)) {
      return error[selectedLanguage] || '';
    }

    return '';
  };

  const renderInput = (value?: string, languageOption?: Locale) => {
    const hasError = showError(meta.error, languageOption);
    const tooltipText = getError(meta.error);

    return (
      <div
        className={`${classes.wrapper} ${isInputHidden(selectedLanguage, hasIntl, languageOption) ? classes.hidden : ''}`}
        key={languageOption}
      >
        <Tooltip open={hasError} title={tooltipText} placement="right-end">
          <TextField
            value={value}
            multiline={multiline}
            rows={4}
            id={`${label}-${languageOption}`}
            label={label}
            className={`${classes.formControl} ${multiline ? classes.multiline : ''}`}
            error={hasError}
            onBlur={handleOnBlur(languageOption)}
            onChange={handleOnChange(languageOption)}
            inputProps={{
              endAdornment: renderLoader()
            }}
          />
        </Tooltip>
         {/* <FormControl
            className={`${classes.formControl} ${multiline ? classes.multiline : ''}`}
            error={hasError}
          >
            <InputLabel htmlFor={label}>
              {label}
            </InputLabel>
            <Input
              id={`${label}-${languageOption}`}
              value={value}
              multiline={multiline}
              rows={4}
              onBlur={handleOnBlur(languageOption)}
              onChange={handleOnChange(languageOption)}
              className={`${multiline ? classes.multilineInput : ''}`}
              classes={{
                error: classes.error
              }}
              endAdornment={renderLoader()}
            />
          </FormControl> */}
      </div>
    );
  };

  const renderIntlInputs = () => LANGUAGES.map(lang => {
    const value = inputValue as TranslatableField;
    return renderInput(value[lang], lang);
  });

  return (
    <React.Fragment>
      {hasIntl ? renderIntlInputs() : renderInput(inputValue as string)}
    </React.Fragment>
  );
}

export default TextInput as any;
