import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, initialize, isSubmitting } from 'redux-form';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { IAppState } from 'reducers';
import { updateItemDescription } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID } from 'client-utils';
import { TItemFields, TItemDescFields } from 'global-utils';
import { extendWithLoader, extendWithLanguage, NavigationPrompt } from 'components';
import { ICreateEditItemPageProps } from '../createEditItem';
import { MainInfoForm, MAIN_INFO_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(MainInfoForm));

interface IDescriptionProps extends ICreateEditItemPageProps, InjectedIntlProps {
  userRole: string;
  showNavigationPrompt: boolean;
  updateItemDescription: (item: TItemDescFields) => Promise<void>;
  initializeForm: (item: TItemDescFields) => void;
}

class DescriptionPageComponent extends React.Component<IDescriptionProps, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item: TItemDescFields) => {
    return this.props.updateItemDescription(item)
      .catch(this.handleErrors);
  }

  getInitialValues = (): TItemDescFields => {
    const { description, metaTitle, metaDescription, metaKeywords  } = this.props.loadedItem;
    return {
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
    };
  }

  render() {
    return this.props.loadedItem ? (
      <div>
        <Typography variant="h5">
          <FormattedMessage id="admin.menu.description" />
        </Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          formatMessage={this.props.intl.formatMessage}
          initialValues={this.getInitialValues()}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: IAppState) => ({
  showNavigationPrompt: isDirty(MAIN_INFO_FORM_NAME)(state) && !isSubmitting(MAIN_INFO_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateItemDescription: (item: TItemFields) => dispatch(updateItemDescription(item)),
  initializeForm: (data: TItemFields) => dispatch(initialize(MAIN_INFO_FORM_NAME, data)),
});

export const DescriptionPage = injectIntl(
  connect<any, any, IDescriptionProps>(mapStateToProps, mapDispatchToProps)(DescriptionPageComponent),
);
