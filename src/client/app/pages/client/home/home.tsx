import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Helmet } from 'react-helmet';
import { injectIntl, WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { TranslatedMessages } from 'types';
import { http } from 'actions/utils';
import { graphqlFetchOptions } from 'client-utils/methods';
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

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    axios(graphqlFetchOptions({
      query: `
        mutation($files: [Upload!]!) {
          uploadPhotos(files: $files, id: "SkEH8QnIoI")
        }
      `,
      variables: {
        files: event.target.files
      }
    }));
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <input type="file" multiple onChange={this.handleChange} />
        {this.renderDocumentHead()}
        <RecommendedItemsWithLoader showLoadingOverlay loaderId={CONTENT_LOADER_ID} />
      </div>
    );
  }
}

export default injectIntl(
  withStyles(styles)(HomePage)
);
