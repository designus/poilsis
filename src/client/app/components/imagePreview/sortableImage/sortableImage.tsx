import * as React from 'react';
import { sortable } from 'react-sortable';

const ImageComponent = (props) => {
  const { classes, isTemporary, children, ...otherProps } = props;
  return (
    <div {...otherProps} draggable={true} className={classes.image}>
      {children}
    </div>
  );
};

export const SortableImage = sortable(ImageComponent);
