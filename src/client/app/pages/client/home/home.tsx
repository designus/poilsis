import * as React from 'react';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { extendWithLoader } from 'components/extendWithLoader';
import { RecommendedItems as Items } from 'components/recommendedItems';

const RecommendedItems = extendWithLoader(Items);

export default class HomePage extends React.Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <RecommendedItems loaderId={CONTENT_LOADER_ID} />
      </React.Fragment>
    );
  }
}
