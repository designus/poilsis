import * as React from 'react';
import { sortable } from 'react-sortable';

const ImageComponent = (props) => {
  const { classes } = props;
  return (
    <div className={classes.image}>
      {props.children}
    </div>
  );
};

export const SortableImage = sortable(ImageComponent);
