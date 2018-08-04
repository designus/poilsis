import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, initialize } from 'redux-form';

import { getBackendErrors, CONTENT_LOADER_ID } from 'client-utils';
import { extendWithLoader, NavigationPrompt } from 'components';
import { IAppState, IType } from 'reducers';
import { TypeForm } from './form';

const FormWithLoader = extendWithLoader(TypeForm);

interface IMatchParams {
  typeId: string;
}

interface ICreateEditTypePageProps extends RouteComponentProps<IMatchParams> {
  loadedType: IType;
  isFormDirty: boolean;
}

class CreateEditTypePageComponent extends React.Component<ICreateEditTypePageProps, any> {

  isCreatePage = !Boolean(this.props.match.params.typeId);

  constructor(props) {
    super(props);
  }

  onSubmit = (type) => {
    // const { isCreatePage, createItem, history, updateItem, initializeForm } = this.props;
    // const submitFn = isCreatePage ? createItem : updateItem;

    // return submitFn(item)
    //   .then(item => {
    //     if (isCreatePage) {
    //       history.push(adminRoutes.editItemMain.getLink(item.userId, item.itemId));
    //     } else {
    //       initializeForm(item);
    //     }
    //   })
    //   .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedType || this.isCreatePage) && (
      <div>
        <Typography variant="headline">{`${this.isCreatePage ? 'Create' : 'Edit'} type`}</Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          initialValues={this.props.loadedType}
        />
        <NavigationPrompt when={this.props.isFormDirty} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditTypePageProps) => ({
  loadedType: state.types.dataMap[props.match.params.typeId],
  isFormDirty: isDirty('TypeForm')(state),
});

export const CreateEditTypePage = connect<{}, {}, any>(mapStateToProps)(CreateEditTypePageComponent);
