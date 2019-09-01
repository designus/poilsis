import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { extendWithLoader } from 'components/extendWithLoader';
import { RecommendedItems as Items } from 'components/recommendedItems';

import { styles } from './styles';

const RecommendedItems = extendWithLoader(Items);

interface IHomePageProps extends WithStyles<typeof styles> {};

class HomePage extends React.Component<IHomePageProps, any> {
  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <RecommendedItems showLoadingOverlay loaderId={CONTENT_LOADER_ID} />
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
