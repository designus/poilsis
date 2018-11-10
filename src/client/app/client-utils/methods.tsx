import * as React from 'react';
import * as FormData from 'form-data';
import { DEFAULT_LANGUAGE, LANGUAGES } from 'global-utils';
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

export function getNormalizedData(data: any[]) {
  return data.reduce((acc: IGenericState<object>, item: any) => {
    acc.dataMap[item.id] = item;
    acc.aliases.push({id: item.id, alias: item.alias});
    return acc;
  }, {dataMap: {}, aliases: []});
}

export function getBackendErrors(errors: Record<string, any>) {
  return Object.keys(errors).reduce((acc, key) => {
    // We only want to display validation errors to the user
    if (errors[key].name === 'ValidatorError') {
      const [field, language] = key.split('.');
      const errorField = LANGUAGES.includes(language) ? field : key;
      acc[errorField] = errors[key].message;
    }
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

export const getFormDataFromFiles = (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files[]', file));
  return formData;
};

export const getSelectedLanguage = () => DEFAULT_LANGUAGE;

export const getAcceptLanguageHeader = () => ({ 'Accept-Language': getSelectedLanguage() });

export const removeItemById = (id: string, dataMap: Record<string, any>) => {
  const { [id]: removedItem, ...remainingItems } = dataMap;
  return remainingItems;
};
