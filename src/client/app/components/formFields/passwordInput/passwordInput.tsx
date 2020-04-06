import React, { useState, useCallback } from 'react';
import { WrappedFieldProps } from 'redux-form';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Tooltip from '@material-ui/core/Tooltip';
import { debounce } from 'lodash';
import { useStyles } from '../textInput/styles';

type Props = WrappedFieldProps;

function PasswordInput(props: Props) {
  const { input, meta, label } = props;
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onChange = useCallback(
    debounce(input.onChange, 600), [input.onChange]
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    onChange(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const hasError = Boolean(meta.touched && meta.invalid);

  return (
    <div className={`${classes.wrapper}`}>
      <Tooltip open={hasError} title={meta.error || ''} placement="right-end">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="password-field">{label}</InputLabel>
          <Input
            id="password-field"
            type={showPassword ? 'text' : 'password'}
            value={password}
            error={hasError}
            onChange={handleOnChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Tooltip>
    </div>
  );
}

export default PasswordInput as any;
