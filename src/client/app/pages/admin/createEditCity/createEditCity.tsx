import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting, initialize, reset } from 'redux-form';

import { TCityFields, ICityFields } from 'global-utils';
import { createCity, updateCity, getAdminCity } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID, adminRoutes } from 'client-utils';
import { extendWithLoader, extendWithLanguage, NavigationPrompt, Loader } from 'components';
import { IAppState, ITypesMap } from 'reducers';
import { CityForm, CITY_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(CityForm));

interface IMatchParams {
  cityId: string;
}

interface ICreateEditCityPageProps extends RouteComponentProps<IMatchParams> {
  loadedCity: TCityFields;
  showNavigationPrompt: boolean;
  typesMap: ITypesMap;
  createCity: (city: TCityFields) => Promise<any>;
  getAdminCity: (cityId: string) => Promise<any>;
  updateCity: (city: TCityFields) => Promise<any>;
  initializeForm: (city: TCityFields) => void;
}

class CreateEditCityPageComponent extends React.Component<ICreateEditCityPageProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.loadedCity && !this.isCreatePage()) {
      this.props.getAdminCity(this.props.match.params.cityId);
    }
  }

  componentDidUpdate(props: ICreateEditCityPageProps) {
    if (props.location.pathname !== this.props.location.pathname) {
      this.props.getAdminCity(this.props.match.params.cityId);
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
          <Typography variant="h5">{`${this.isCreatePage() ? 'Create' : 'Edit'} city`}</Typography>
          <FormWithLoader
            onSubmit={this.onSubmit}
            loaderId={CONTENT_LOADER_ID}
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
});

const mapDispatchToProps = (dispatch) => ({
  getAdminCity: (id: string) => dispatch(getAdminCity(id)),
  createCity: (city: TCityFields) => dispatch(createCity(city)),
  updateCity: (city: TCityFields) => dispatch(updateCity(city)),
  initializeForm: (city: TCityFields) => dispatch(initialize(CITY_FORM_NAME, city)),
});

export const CreateEditCityPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditCityPageComponent);
