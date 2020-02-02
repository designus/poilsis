import * as React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
// @ts-ignore
import reduxFormActions from 'redux-form/es/actions';
import { injectIntl, defineMessages } from 'react-intl';

import { ICity, LANGUAGES, DEFAULT_LANGUAGE, isClient } from 'global-utils';
import { createCity, updateCity, getAdminCity } from 'actions/cities';
import { getBackendErrors } from 'client-utils/methods';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { IAppState, ThunkDispatch } from 'types';
import { shouldLoadEditCity, getTypesMap, getCityById, getAdminLocale } from 'selectors';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';
import { Loader } from 'components/loader';

import { CityForm, CITY_FORM_NAME } from './form';
import { IOwnProps, IStateProps, IDispatchProps, Props } from './types';

const { initialize } = reduxFormActions;
const FormWithLoader = extendWithLoader(extendWithLanguage(CityForm));

const messages = defineMessages({
  createCity: {
    id: 'admin.city.create_title',
    defaultMessage: 'Create city'
  },
  editCity: {
    id: 'admin.city.edit_title',
    defaultMessage: 'Edit city'
  }
});

class CreateEditCity extends React.Component<Props> {
  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadEditCity) {
      this.props.getCity(this.props.match.params.cityId).then(city => {
        this.props.initializeForm(city);
      });
    }
  }

  isCreatePage = () => !Boolean(this.props.match.params.cityId);

  handleErrors(errors: Record<string, any>) {
    console.error('Errors', errors);
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (city: ICity) => {
    const { createCity, history, updateCity, initializeForm } = this.props;
    const submitFn = this.isCreatePage() ? createCity : updateCity;
    return submitFn(city)
      .then((newCity: ICity) => {
        if (this.isCreatePage()) {
          history.push(adminRoutes.editCity.getLink(newCity.id));
        } else {
          // We should initialize form with internationalized fields
          initializeForm(newCity);
        }
      })
      .catch(this.handleErrors);
  }

  renderTitle = () => {
    return isClient() && ReactDOM.createPortal(
      <span> / {this.props.intl.formatMessage(this.isCreatePage() ? messages.createCity : messages.editCity)}</span>,
      document.querySelector('.editItemName')
    );
  }

  render() {
    return (this.props.loadedCity || this.isCreatePage()) &&
      (
        <React.Fragment>
          {this.renderTitle()}
          <FormWithLoader
            onSubmit={this.onSubmit}
            loaderId={CONTENT_LOADER_ID}
            intl={this.props.intl}
            showLoadingOverlay={true}
            typesMap={this.props.typesMap}
            locale={this.props.locale}
            initialValues={this.props.loadedCity}
            languages={LANGUAGES}
            defaultLanguage={DEFAULT_LANGUAGE}
          />
          <NavigationPrompt when={this.props.showNavigationPrompt} />
        </React.Fragment>
      ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: IOwnProps): IStateProps => ({
  typesMap: getTypesMap(state),
  loadedCity: getCityById(state, props.match.params.cityId),
  showNavigationPrompt: isDirty(CITY_FORM_NAME)(state) && !isSubmitting(CITY_FORM_NAME)(state),
  shouldLoadEditCity: shouldLoadEditCity(state, props.match.params.cityId),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  getCity: cityId => dispatch(getAdminCity(cityId)),
  createCity: city => dispatch(createCity(city)),
  updateCity: city => dispatch(updateCity(city)),
  initializeForm: city => dispatch(initialize(CITY_FORM_NAME, city))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(CreateEditCity)
);
