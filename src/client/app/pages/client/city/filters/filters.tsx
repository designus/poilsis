import React, { memo } from 'react';

import { useStyles } from './styles';

type Props = {};

export const Filters: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      Filters section
    </div>
  );
};
