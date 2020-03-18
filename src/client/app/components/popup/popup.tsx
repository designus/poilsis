import React, { useState } from 'react';
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
};

export const Popup: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <InputLabel focused={isOpen} shrink={isOpen}>{props.label}</InputLabel>
        <Input readOnly id="component-simple" endAdornment={renderArrow()} />
        <div className={classes.mask} onClick={handleClick} />
      </FormControl>
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Typography className={classes.typography}>
          {props.children}
        </Typography>
      </Popover>
    </FormControl>
  );
};
