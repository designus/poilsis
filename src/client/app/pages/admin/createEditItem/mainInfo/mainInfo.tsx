import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
import reduxFormActions from 'redux-form/es/actions';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { getTypesMap, getUsersMap, getCitiesMap, getCurrentUserRole, getAdminLocale } from 'selectors';
import { IAppState, ICitiesMap, ITypesMap, IUsersMap } from 'types';
import { updateMainInfo, createItem } from 'actions/items';
import { getBackendErrors } from 'client-utils/methods';
import { adminRoutes } from 'client-utils/routes';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { IItem } from 'global-utils';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';
import { ICreateEditItemPageProps } from '../createEditItem';
import { MainInfoForm, MAIN_INFO_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(MainInfoForm));
const { initialize } = reduxFormActions;

interface IMainInfoProps extends ICreateEditItemPageProps, InjectedIntlProps {
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  userRole: string;
  locale: string;
  showNavigationPrompt: boolean;
  isCreatePage: boolean;
  createItem: (item: IItem) => Promise<any>;
  updateItem: (item: IItem) => Promise<any>;
  initializeForm: (item: IItem) => void;
}

class MainInfoPage extends React.Component<IMainInfoProps, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item: IItem) => {
    const { isCreatePage, createItem, history, updateItem, initializeForm } = this.props;
    const submitFn = isCreatePage ? createItem : updateItem;
    return submitFn(item)
      .then((newItem: IItem) => {
        if (isCreatePage) {
          history.push(adminRoutes.editItemMain.getLink(newItem.userId, newItem.id));
        } else {
          initializeForm(item);
        }
      })
      .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedItem || this.props.isCreatePage) ? (
      <div>
        <Typography variant="h5">
          <FormattedMessage id="admin.menu.main_info" />
        </Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          citiesMap={this.props.citiesMap}
          locale={this.props.locale}
          formatMessage={this.props.intl.formatMessage}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: IAppState) => ({
  usersMap: getUsersMap(state),
  citiesMap: getCitiesMap(state),
  typesMap: getTypesMap(state),
  userRole: getCurrentUserRole(state),
  showNavigationPrompt: isDirty(MAIN_INFO_FORM_NAME)(state) && !isSubmitting(MAIN_INFO_FORM_NAME)(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  updateItem: (item: IItem) => dispatch(updateMainInfo(item)),
  createItem: (item: IItem) => dispatch(createItem(item)),
  initializeForm: (data: IItem) => dispatch(initialize(MAIN_INFO_FORM_NAME, data))
});

export default injectIntl(
  connect<any, any, IMainInfoProps>(mapStateToProps, mapDispatchToProps)(MainInfoPage)
);
