import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting, initialize } from 'redux-form';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { ITypeFields, TTypeFields } from 'global-utils';
import { createType, updateType, getAdminType } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID, adminRoutes } from 'client-utils';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';
import { Loader } from 'components/loader';
import { IAppState } from 'reducers';
import { shouldLoadType } from 'selectors';

import { TypeForm, TYPE_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(TypeForm));

interface IMatchParams {
  typeId: string;
}

interface ICreateEditTypePageProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {
  loadedType: TTypeFields;
  showNavigationPrompt: boolean;
  getType: (typeId: string) => Promise<any>;
  createType: (type: TTypeFields) => Promise<any>;
  updateType: (type: TTypeFields) => Promise<any>;
  initializeForm: (type: TTypeFields) => void;
  shouldLoadType: boolean;
}

class CreateEditTypePageComponent extends React.Component<ICreateEditTypePageProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadType) {
      this.props.getType(this.props.match.params.typeId);
    }
  }

  componentDidUpdate(props: ICreateEditTypePageProps) {
    // When we navigate from create page to update we need to load updated city
    if (props.location.pathname !== this.props.location.pathname || this.props.shouldLoadType) {
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
        <Typography variant="h5">
          <FormattedMessage id={`admin.type.${this.isCreatePage() ? 'create' : 'edit'}_title`} />
        </Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          formatMessage={this.props.intl.formatMessage}
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
  shouldLoadType: shouldLoadType(state, props.match.params.typeId)
});

const mapDispatchToProps = (dispatch) => ({
  getType: (typeId: string) => dispatch(getAdminType(typeId)),
  createType: (type: TTypeFields) => dispatch(createType(type)),
  updateType: (type: TTypeFields) => dispatch(updateType(type)),
  initializeForm: (type: TTypeFields) => dispatch(initialize(TYPE_FORM_NAME, type))
});

export const CreateEditTypePage = injectIntl(
  connect<{}, {}, ICreateEditTypePageProps>(mapStateToProps, mapDispatchToProps)(CreateEditTypePageComponent)
);
