import * as React from 'react';
import { SortableImage } from '../sortableImage';

export const ImageWrapper = (props) => {
  const { isTemporary, children, classes } = props;

  if (isTemporary) {
    return (
      <div className={classes.image}>
        {children}
      </div>
    );
  }

  return (
    <SortableImage {...props}>
      {children}
    </SortableImage>
  );
};
