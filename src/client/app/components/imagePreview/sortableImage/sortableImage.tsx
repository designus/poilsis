import * as React from 'react';
import { sortable } from 'react-sortable';

const ImageComponent = (props) => {
  const { classes, otherProps } = props;
  return (
    <div {...otherProps} draggable={true} className={classes.image}>
      {props.children}
    </div>
  );
};

export const SortableImage = sortable(ImageComponent);
