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

export const getNormalizedData = (data, initial = {dataMap: {}, ids: [], aliases: []}) => {
    return data.reduce((acc, item) => {
        return {
            ...acc, 
            dataMap: {
                ...acc.dataMap, 
                [item.id]: item
            },
            ids: [...acc.ids, item.id],
            aliases: [
                ...acc.aliases, 
                {
                    id: item.id, 
                    alias: item.alias
                }
            ]
        }
    }, initial)
}