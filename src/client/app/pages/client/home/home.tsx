import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { extendWithLoader } from 'components/extendWithLoader';
import { RecommendedItems } from './recommendedItems';

import { styles } from './styles';

const RecommendedItemsWithLoader = extendWithLoader(RecommendedItems);

interface IHomePageProps extends WithStyles<typeof styles> {}

class HomePage extends React.Component<IHomePageProps, any> {
  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <RecommendedItemsWithLoader showLoadingOverlay loaderId={CONTENT_LOADER_ID} />
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
