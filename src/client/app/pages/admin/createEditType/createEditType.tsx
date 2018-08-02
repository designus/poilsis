import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, IType } from 'reducers';

interface IMatchParams {
  typeId: string;
  userId: string;
}

interface ICreateEditTypePageProps extends RouteComponentProps<IMatchParams> {
  loadedType: IType;
  getType: (id) => void;
}

class CreateEditTypePageComponent extends React.Component<ICreateEditTypePageProps, any> {

  isCreatePage = !Boolean(this.props.match.params.typeId);

  constructor(props) {
    super(props);
  }

  // static fetchData(store, params) {
  //   if (params.id) {
  //     return store.dispatch(getItem(params.itemId));
  //   } else {
  //     return Promise.resolve(null);
  //   }
  // }

  render() {
    return (this.props.loadedType || this.isCreatePage) && (
      <div>
        asfa
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditTypePageProps) => ({
  loadedType: state.types.dataMap[props.match.params.typeId],
});

export const CreateEditTypePage = connect<{}, {}, any>(mapStateToProps)(CreateEditTypePageComponent);
