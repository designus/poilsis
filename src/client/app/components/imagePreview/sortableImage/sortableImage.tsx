import * as React from 'react';
import { WithStyles } from '@material-ui/core/styles';
// @ts-ignore
import { sortable } from 'react-sortable';

import { styles } from '../style';

type Props = WithStyles<typeof styles> & {
  isTemporary: boolean;
  onSortItems: any;
};

const ImageComponent: React.FunctionComponent<Props> = (props) => {
  const { classes, isTemporary, children, ...otherProps } = props;

  return (
    <div {...otherProps} draggable={true} className={classes.image}>
      {children}
    </div>
  );
};

export const SortableImage = sortable(ImageComponent);
