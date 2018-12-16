import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting, initialize } from 'redux-form';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { TCityFields, ICityFields } from 'global-utils';
import { createCity, updateCity, getAdminCity } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID, adminRoutes } from 'client-utils';
import { extendWithLoader, extendWithLanguage, NavigationPrompt, Loader } from 'components';
import { IAppState, ITypesMap } from 'reducers';
import { shouldLoadCity } from 'selectors';
import { CityForm, CITY_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(CityForm));

interface IMatchParams {
  cityId: string;
}

interface ICreateEditCityPageProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {
  loadedCity: TCityFields;
  showNavigationPrompt: boolean;
  typesMap: ITypesMap;
  createCity: (city: TCityFields) => Promise<any>;
  updateCity: (city: TCityFields) => Promise<any>;
  getCity: (cityId: string) => Promise<any>;
  initializeForm: (city: TCityFields) => void;
  shouldLoadCity: boolean;
}

class CreateEditCityPageComponent extends React.Component<ICreateEditCityPageProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadCity) {
      this.props.getCity(this.props.match.params.cityId);
    }
  }

  componentDidUpdate(props: ICreateEditCityPageProps) {
    // When we navigate from create page to update we need to load updated city
    if (props.location.pathname !== this.props.location.pathname || this.props.shouldLoadCity) {
      this.props.getCity(this.props.match.params.cityId);
    }
  }

  isCreatePage = () => !Boolean(this.props.match.params.cityId);

  handleErrors(errors: Record<string, any>) {
    console.error('Errors', errors);
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (city: TCityFields) => {
    const { createCity, history, updateCity, initializeForm } = this.props;
    const submitFn = this.isCreatePage() ? createCity : updateCity;
    return submitFn(city)
      .then((newCity: ICityFields) => {
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
            initialValues={this.props.loadedCity}
          />
          <NavigationPrompt when={this.props.showNavigationPrompt} />
        </div>
      ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditCityPageProps) => ({
  typesMap: state.types.dataMap,
  loadedCity: state.admin.cities[props.match.params.cityId],
  showNavigationPrompt: isDirty(CITY_FORM_NAME)(state) && !isSubmitting(CITY_FORM_NAME)(state),
  shouldLoadCity: shouldLoadCity(state, props.match.params.cityId),
});

const mapDispatchToProps = (dispatch) => ({
  getCity: (id: string) => dispatch(getAdminCity(id)),
  createCity: (city: TCityFields) => dispatch(createCity(city)),
  updateCity: (city: TCityFields) => dispatch(updateCity(city)),
  initializeForm: (city: TCityFields) => dispatch(initialize(CITY_FORM_NAME, city)),
});

export const CreateEditCityPage = injectIntl(
  connect<{}, {}, ICreateEditCityPageProps>(mapStateToProps, mapDispatchToProps)(CreateEditCityPageComponent),
);
