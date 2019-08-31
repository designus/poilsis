import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
import reduxFormActions from 'redux-form/es/actions';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { ICity } from 'global-utils';
import { createCity, updateCity } from 'actions/cities';
import { getAdminCity } from 'actions/admin';
import { getBackendErrors } from 'client-utils/methods';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { IAppState, ITypesMap } from 'types';
import { shouldLoadEditCity, getTypesMap, getCityById, getLocale } from 'selectors';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';
import { Loader } from 'components/loader';

import { CityForm, CITY_FORM_NAME } from './form';

const { initialize } = reduxFormActions;
const FormWithLoader = extendWithLoader(extendWithLanguage(CityForm));

interface IMatchParams {
  cityId: string;
}

interface ICreateEditCityPageProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {
  loadedCity: ICity;
  showNavigationPrompt: boolean;
  typesMap: ITypesMap;
  createCity: (city: ICity) => Promise<any>;
  updateCity: (city: ICity) => Promise<any>;
  getCity: (cityId: string) => Promise<any>;
  initializeForm: (city: ICity) => void;
  shouldLoadEditCity: boolean;
  locale: string;
}

class CreateEditCityPageComponent extends React.Component<ICreateEditCityPageProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadEditCity) {
      this.props.getCity(this.props.match.params.cityId);
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
          initializeForm(city);
        }
      })
      .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedCity || this.isCreatePage()) &&
      (
        <div>
          <Typography variant="h5">
            <FormattedMessage id={`admin.city.${this.isCreatePage() ? 'create' : 'edit'}_title`} />
          </Typography>
          <FormWithLoader
            onSubmit={this.onSubmit}
            loaderId={CONTENT_LOADER_ID}
            formatMessage={this.props.intl.formatMessage}
            showLoadingOverlay={true}
            typesMap={this.props.typesMap}
            locale={this.props.locale}
            initialValues={this.props.loadedCity}
          />
          <NavigationPrompt when={this.props.showNavigationPrompt} />
        </div>
      ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditCityPageProps) => ({
  typesMap: getTypesMap(state),
  loadedCity: getCityById(state, props.match.params.cityId),
  showNavigationPrompt: isDirty(CITY_FORM_NAME)(state) && !isSubmitting(CITY_FORM_NAME)(state),
  shouldLoadEditCity: shouldLoadEditCity(state, props.match.params.cityId),
  locale: getLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  getCity: (id: string) => dispatch(getAdminCity(id)),
  createCity: (city: ICity) => dispatch(createCity(city)),
  updateCity: (city: ICity) => dispatch(updateCity(city)),
  initializeForm: (city: ICity) => dispatch(initialize(CITY_FORM_NAME, city))
});

export const CreateEditCityPage = injectIntl(
  connect<{}, {}, ICreateEditCityPageProps>(mapStateToProps, mapDispatchToProps)(CreateEditCityPageComponent)
);
