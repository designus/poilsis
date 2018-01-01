import * as React from 'react';
import { sortable } from 'react-sortable';
import { Image } from '../style';

const ImageComponent = (props) => {
  return (
    <Image {...props}>
      {props.children}
    </Image>
  );
};

export const SortableImage = sortable(ImageComponent);
