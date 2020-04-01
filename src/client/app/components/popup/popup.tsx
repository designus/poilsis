import React, { useState, useEffect } from 'react';
import Popover from '@material-ui/core/Popover';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import DropdownArrow from '@material-ui/icons/ArrowDropDown';
import DropupArrow from '@material-ui/icons/ArrowDropUp';
import { useStyles } from './styles';

export type Props = {
  trigger?: JSX.Element;
  maxWidth?: number;
  isOutlined?: boolean;
  label: string;
  value: string;
  popupKey?: number;
};

export const Popup: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => handleClose(), [props.popupKey]);

  const handleClick = (event: React.MouseEvent<any>) => {
    setIsOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  const id = isOpen ? 'simple-popover' : undefined;

  const renderArrow = () => isOpen
    ? <DropupArrow className={classes.icon} />
    : <DropdownArrow className={classes.icon} />;

  return (
    <FormControl className={classes.wrapper}>
      <FormControl>
        <InputLabel focused={isOpen} shrink={Boolean(props.value) || isOpen}>{props.label}</InputLabel>
        <Input value={props.value} readOnly id="component-simple" endAdornment={renderArrow()} />
        <div className={classes.mask} onClick={handleClick} />
      </FormControl>
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{
          paper: classes.popover
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {props.children}
      </Popover>
    </FormControl>
  );
};
