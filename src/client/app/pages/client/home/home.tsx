import * as React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { TranslatedMessages } from 'types';
import { extendWithLoader } from 'components/extendWithLoader';
import { RecommendedItems } from './recommendedItems';

import { styles } from './styles';

const RecommendedItemsWithLoader = extendWithLoader(RecommendedItems);

const messages: TranslatedMessages = {
  title: {
    id: 'client.home_title',
    defaultMessage: 'Accomodation in Baltic seaside'
  },
  metaDescription: {
    id: 'client.meta_description',
    defaultMessage: 'Accomodation offers in Baltic seaside'
  }
};

interface IHomePageProps extends WithStyles<typeof styles>, InjectedIntlProps {}

class HomePage extends React.Component<IHomePageProps, any> {

  renderDocumentHead = () => {
    return (
      <Helmet>
        <title>
          {this.props.intl.formatMessage(messages.title)};
        </title>
        <meta name="description" content={this.props.intl.formatMessage(messages.metaDescription)} />
      </Helmet>
    );
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        {this.renderDocumentHead()}
        <RecommendedItemsWithLoader showLoadingOverlay loaderId={CONTENT_LOADER_ID} />
      </div>
    );
  }
}

export default injectIntl(
  withStyles(styles)(HomePage)
);
