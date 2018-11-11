import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting, initialize } from 'redux-form';

import { ITypeFields, TTypeFields } from 'global-utils';
import { createType, updateType, getAdminType } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID, adminRoutes } from 'client-utils';
import { extendWithLoader, extendWithLanguage, NavigationPrompt, Loader } from 'components';
import { IAppState } from 'reducers';
import { TypeForm, TYPE_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(TypeForm));

interface IMatchParams {
  typeId: string;
}

interface ICreateEditTypePageProps extends RouteComponentProps<IMatchParams> {
  loadedType: TTypeFields;
  showNavigationPrompt: boolean;
  getType: (typeId: string) => Promise<any>;
  createType: (type: TTypeFields) => Promise<any>;
  updateType: (type: TTypeFields) => Promise<any>;
  initializeForm: (type: TTypeFields) => void;
}

class CreateEditTypePageComponent extends React.Component<ICreateEditTypePageProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.loadedType && !this.isCreatePage()) {
      this.props.getType(this.props.match.params.typeId);
    }
  }

  componentDidUpdate(props: ICreateEditTypePageProps) {
    // When we navigate from create page to update we need to load updated city
    if (props.location.pathname !== this.props.location.pathname) {
      this.props.getType(this.props.match.params.typeId);
    }
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  isCreatePage = () => !Boolean(this.props.match.params.typeId);

  onSubmit = (type: TTypeFields) => {
    const { createType, history, updateType, initializeForm } = this.props;
    const submitFn = this.isCreatePage() ? createType : updateType;
    return submitFn(type)
      .then((newType: ITypeFields) => {
        if (this.isCreatePage()) {
          history.push(adminRoutes.editType.getLink(newType.id));
        } else {
          initializeForm(type);
        }
      })
      .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedType || this.isCreatePage()) && (
      <div>
        <Typography variant="h5">{`${this.isCreatePage() ? 'Create' : 'Edit'} type`}</Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          initialValues={this.props.loadedType}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditTypePageProps) => ({
  loadedType: state.admin.types[props.match.params.typeId],
  showNavigationPrompt: isDirty(TYPE_FORM_NAME)(state) && !isSubmitting(TYPE_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => ({
  getType: (typeId: string) => dispatch(getAdminType(typeId)),
  createType: (type: TTypeFields) => dispatch(createType(type)),
  updateType: (type: TTypeFields) => dispatch(updateType(type)),
  initializeForm: (type: TTypeFields) => dispatch(initialize(TYPE_FORM_NAME, type)),
});

export const CreateEditTypePage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditTypePageComponent);
