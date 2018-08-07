import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting, initialize } from 'redux-form';

import { ITypeFields } from 'global-utils';
import { createType, updateType } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID, adminRoutes } from 'client-utils';
import { extendWithLoader, NavigationPrompt } from 'components';
import { IAppState, IType } from 'reducers';
import { TypeForm, TYPE_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(TypeForm);

interface IMatchParams {
  typeId: string;
}

interface ICreateEditTypePageProps extends RouteComponentProps<IMatchParams> {
  loadedType: IType;
  showNavigationPrompt: boolean;
  createType: (type: ITypeFields) => Promise<any>;
  updateType: (type: ITypeFields) => Promise<any>;
  initializeForm: (type: ITypeFields) => void;
}

class CreateEditTypePageComponent extends React.Component<ICreateEditTypePageProps, any> {

  isCreatePage = !Boolean(this.props.match.params.typeId);

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (type: ITypeFields) => {
    const { createType, history, updateType, initializeForm } = this.props;
    const submitFn = this.isCreatePage ? createType : updateType;
    return submitFn(type)
      .then(newType => {
        if (this.isCreatePage) {
          history.push(adminRoutes.editType.getLink(newType.id));
        } else {
          initializeForm(newType);
        }
      })
      .catch(this.handleErrors);
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
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditTypePageProps) => ({
  loadedType: state.types.dataMap[props.match.params.typeId],
  showNavigationPrompt: isDirty(TYPE_FORM_NAME)(state) && !isSubmitting(TYPE_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => ({
  createType: (type: ITypeFields) => dispatch(createType(type)),
  updateType: (type: ITypeFields) => dispatch(updateType(type)),
  initializeForm: (type: ITypeFields) => dispatch(initialize(TYPE_FORM_NAME, type)),
});

export const CreateEditTypePage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditTypePageComponent);
