import * as React from 'react';
import { ValueType, IKeyMap, IGenericState, TGenericFormModel, IGenericFormState } from './types';
import { IItemsMap, ItemsDataMap, ICityState, ICityItems } from '../reducers';

export function getSelectedCity(citiesState: ICityState, city: string) {
  return new Promise((resolve, reject) => {
    const {aliases} = citiesState;
    const selectedCity = aliases.find(({alias, id}) => alias === city);
    if (selectedCity) {
      resolve(selectedCity);
    } else {
      reject('City is not available');
    }
  });
};

export const getCityItems = (dataMap: ItemsDataMap, haveAllItemsLoaded: boolean) => {
  return Object.keys(dataMap).reduce((acc: ICityItems, itemId: string) => {
    const item: IItemsMap = dataMap[itemId];
    const state = acc[item.city];
    if (state) {
      state.items.push(itemId);
    } else {
      acc[item.city] = {
        items: [itemId],
        haveAllItemsLoaded,
      };
    }
    return acc;
  }, {});
};

export function getNormalizedData(data: any[], additionalInfo?) {
  return data.reduce((acc: IGenericState<object>, item: any) => {
    acc.dataMap[item.id] = additionalInfo ? {...item, ...additionalInfo} : item;
    acc.aliases.push({id: item.id, alias: item.alias});
    return acc;
  }, {dataMap: {}, aliases: []});
};

export function getFormFieldsFromModel(model: TGenericFormModel<object>) {
  return Object.keys(model).reduce((acc: {[key: string]: any}, key: string) => {
    const modelKeyValue = model[key].value;
    let newValue;
    if (Array.isArray(modelKeyValue)) {
      newValue = [...modelKeyValue];
    } else if (typeof modelKeyValue === 'object' && modelKeyValue !== null) {
      newValue = {...modelKeyValue};
    } else {
      newValue = modelKeyValue;
    }
    acc[key] = newValue;
    return acc;
  }, {});
};

export function getFormStateWithData(data, emptyState: IGenericFormState<object>) {
  const fields = Object.keys(emptyState.fields).reduce((acc, key) => {
    acc[key] = data[key] || emptyState.fields[key];
    return acc;
  }, {});

  return {...emptyState, fields};
};

export function getFormErrorsFromModel(model: TGenericFormModel<object>) {
  return Object.keys(model).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});
}

export function getInitialFormState(model: TGenericFormModel<object>): IGenericFormState<object> {
  return {
    fields: getFormFieldsFromModel(model),
    errors: getFormErrorsFromModel(model),
    showErrors: false,
    model,
  };
};

export function getKeyMap(value: ValueType, title: string, validators: any[]): IKeyMap {
  return { value, title, validators };
};

export const voidFn = (f) => f;

export function getMergedErrors(backendErrors, frontendErrors) {
  return Object.keys(frontendErrors).reduce((acc, field) => {

    const fieldErrors = backendErrors[field]
    ? [...frontendErrors[field], backendErrors[field].message]
    : frontendErrors[field];

    return {...acc, [field]: fieldErrors };
  }, {});
};

export function getBackendErrors(errors) {
  return Object.keys(errors).reduce((acc, key) => {
    acc[key] = [errors[key].message];
    return acc;
  }, {});
}

export function removeDuplicates(item, i, arr) {
  return arr.indexOf(item) === i;
}

export function removeInjectedStyles() {
  if (document) {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
}

// export function getFormData(item) {
//   const formData = new FormData();

//   Object.keys(item)
//     .forEach(key => {
//       if (key === 'files') {
//         item[key].forEach(elem => {
//           formData.append(key + '[]', elem);
//         });
//       } else {
//         formData.append(key, item[key]);
//       }
//     });

//   return formData;
// }

export function onUploadProgress(e, callback) {
  const totalLength = e.lengthComputable ?
  e.total :
  e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
  if (totalLength !== null) {
    // Leave 10% upload progress space for the time to transform uploaded images to thumbnails
    const loadedPercent = Math.round((e.loaded * 100) / totalLength - 10);
    callback(loadedPercent);
  }
};

export const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};
