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
import { isInputHidden } from 'client-utils/methods';

import { LANGUAGES, DEFAULT_LANGUAGE, hasLocalizedFields, TranslatableField } from 'global-utils';
import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {
  hasIntl: boolean;
  selectedLanguage: string;
  isHidden: string;
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

  const showError = (error: string | TranslatableField, language: string) => {
    if (typeof error === 'string') {
      const hasError = Boolean(meta.touched && meta.invalid && meta.error);
      if (language) {
        // Show error only on main language tab
        return hasError && selectedLanguage === DEFAULT_LANGUAGE && language === DEFAULT_LANGUAGE;
      }
      return hasError;
    }

    return Boolean(meta.touched && meta.invalid && meta.error[language] && language === selectedLanguage);
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

  const renderInput = (value: string, languageOption?: string) => {
    const hasError = showError(meta.error, languageOption);
    const tooltipText = getError(meta.error);

    return (
      <div
        className={`${classes.wrapper} ${isInputHidden(languageOption, selectedLanguage, hasIntl) ? classes.hidden : ''}`}
        key={languageOption}
      >
        <Tooltip open={hasError} title={tooltipText} placement="right-end">
          <FormControl
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
