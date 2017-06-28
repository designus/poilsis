import {selectCity} from '../actions/cities';

export const selectCityIfValid = (store, reqParam) => {
    const state = store.getState();
    const {aliases, selectedId}  = state.cities;
    const selectedCity = aliases.find(({alias, id}) => alias === reqParam);
    // we dispatch only if city is available and if 
    if (selectedCity) {
        store.dispatch(selectCity(selectedCity.id));
    }
}