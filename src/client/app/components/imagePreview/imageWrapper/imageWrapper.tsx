import * as React from 'react';
import { SortableImage } from '../sortableImage';

interface IImageWrapperProps {
  isTemporary: boolean;
  children: any;
  classes: any;
  onSortItems: (items: any[]) => void;
  items: any[];
  key: string | number;
  sortId: string | number;
}

export const ImageWrapper = (props: IImageWrapperProps) => {
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
