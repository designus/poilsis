import * as React from 'react';
import { IGenericState } from './types';
import { IItem, IItemsMap, ICityState, ICityItems } from '../reducers';

export function getSelectedCity(citiesState: ICityState, city: string) {
  return new Promise((resolve, reject) => {
    const { aliases } = citiesState;
    const selectedCity = aliases.find(({ alias, id }) => alias === city);
    if (selectedCity) {
      resolve(selectedCity);
    } else {
      reject('City is not available');
    }
  });
}

export const getCityItems = (dataMap: IItemsMap, haveAllItemsLoaded: boolean) => {
  return Object.keys(dataMap).reduce((acc: ICityItems, itemId: string) => {
    const item: IItem = dataMap[itemId];
    const state = acc[item.cityId];
    if (state) {
      state.items.push(itemId);
    } else {
      acc[item.cityId] = {
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
}

export const voidFn = (f) => f;

export function getBackendErrors(errors) {
  return Object.keys(errors).reduce((acc, key) => {
    acc[key] = errors[key].message;
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

export function onUploadProgress(e, callback) {
  const totalLength = e.lengthComputable ?
  e.total :
  e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
  if (totalLength !== null) {
    // Leave 10% upload progress space for the time to transform uploaded images to thumbnails
    const loadedPercent = Math.round((e.loaded * 100) / totalLength - 10);
    callback(loadedPercent);
  }
}

export const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};
