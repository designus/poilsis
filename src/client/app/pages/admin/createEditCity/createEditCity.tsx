import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting, initialize } from 'redux-form';

import { ICityFields } from 'global-utils';
import { createCity, updateCity } from 'actions';
import { getBackendErrors, CONTENT_LOADER_ID, adminRoutes } from 'client-utils';
import { extendWithLoader, NavigationPrompt } from 'components';
import { IAppState, ICity, ITypesMap } from 'reducers';
import { CityForm, CITY_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(CityForm);

interface IMatchParams {
  cityId: string;
}

interface ICreateEditCityPageProps extends RouteComponentProps<IMatchParams> {
  loadedCity: ICity;
  showNavigationPrompt: boolean;
  typesMap: ITypesMap;
  createCity: (city: ICityFields) => Promise<any>;
  updateCity: (city: ICityFields) => Promise<any>;
  initializeForm: (city: ICityFields) => void;
}

class CreateEditCityPageComponent extends React.Component<ICreateEditCityPageProps, any> {

  isCreatePage = !Boolean(this.props.match.params.cityId);

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (city: ICityFields) => {
    const { createCity, history, updateCity, initializeForm } = this.props;
    const submitFn = this.isCreatePage ? createCity : updateCity;
    return submitFn(city)
      .then(newCity => {
        if (this.isCreatePage) {
          history.push(adminRoutes.editCity.getLink(newCity.id));
        } else {
          initializeForm(newCity);
        }
      })
      .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedCity || this.isCreatePage) && (
      <div>
        <Typography variant="headline">{`${this.isCreatePage ? 'Create' : 'Edit'} city`}</Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          typesMap={this.props.typesMap}
          initialValues={this.props.loadedCity}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditCityPageProps) => ({
  typesMap: state.types.dataMap,
  loadedCity: state.cities.dataMap[props.match.params.cityId],
  showNavigationPrompt: isDirty(CITY_FORM_NAME)(state) && !isSubmitting(CITY_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => ({
  createCity: (city: ICityFields) => dispatch(createCity(city)),
  updateCity: (city: ICityFields) => dispatch(updateCity(city)),
  initializeForm: (city: ICityFields) => dispatch(initialize(CITY_FORM_NAME, city)),
});

export const CreateEditCityPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditCityPageComponent);
