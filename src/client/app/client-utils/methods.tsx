import * as React from 'react';
import * as FormData from 'form-data';
import { memoize } from 'lodash';
import { getItemById } from 'selectors';
import { DEFAULT_LANGUAGE, LANGUAGES } from 'global-utils/constants';
import { DataTypes, IUser, IItem, Locale, IAccessTokenClaims, IsEnabled } from 'global-utils/typings';
import { TranslatableField, hasLocalizedFields, ICity } from 'global-utils';
import { getInitialCityFilters } from 'reducers/filters';
import { IGenericState, IGenericDataMap, IDropdownOption, IAliasMap, IAppState, UserDetails, CitiesFilterState } from 'types';

export function getNormalizedData<T extends DataTypes | IUser>(data: T[]): IGenericState<T> {
  return data.reduce((acc: IGenericState<T>, item: T) => {
    acc.dataMap[item.id] = item;
    acc.aliases = { ...acc.aliases, ...getAliasState(item.alias, item.id) };
    return acc;
  }, { dataMap: {}, aliases: {} });
}

export const getAliasState = (alias: string | TranslatableField, id: string): IAliasMap => {
  const aliases: IAliasMap = {};
  if (hasLocalizedFields(alias)) {
    Object.values(alias).forEach(alias => {
      aliases[alias as string] = id;
    });
  }

  if (typeof alias === 'string') {
    aliases[alias] = id;
  }

  return aliases;
};

export function getAliasKeysById<T extends DataTypes>(state: IGenericState<T>, id: string): string[] {
  const { alias } = state.dataMap[id];
  return hasLocalizedFields(alias) ? Object.values(alias) : [alias as string];
}

export const setAcceptLanguageHeader = (locale: Locale = DEFAULT_LANGUAGE) => ({
  headers: {
    'Accept-Language': locale
  }
});

export function getBackendErrors(errors: Record<string, any>) {
  return Object.keys(errors).reduce((acc: any, key) => {
    // We only want to display validation errors to the user
    if (errors[key].name === 'ValidatorError') {
      const [field, language] = key.split('.');
      const errorField = LANGUAGES.includes(language as Locale) ? field : key;
      acc[errorField] = errors[key].message;
    }
    return acc;
  }, {});
}

export function removeInjectedStyles() {
  if (document) {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
}

export function onUploadProgress(e: any, callback: (loadedPercent: number) => void) {
  const totalLength = e.lengthComputable ?
  e.total :
  e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
  if (totalLength !== null) {
    // Leave 10% upload progress space for the time to transform uploaded images to thumbnails
    const loadedPercent = Math.round((e.loaded * 100) / totalLength - 10);
    callback(loadedPercent);
  }
}

export const renderMergedProps = (component: any, ...rest: any) => {
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

export function removeByKeys<T>(keys: string[], dataMap: IGenericDataMap<T>): IGenericDataMap<T> {
  return Object.keys(dataMap).reduce((acc: any, key) => {
    if (!keys.includes(key)) {
      acc[key] = dataMap[key];
    }
    return acc;
  }, {});
}

export const capitalize = (word: string) => word.slice(0, 1).toUpperCase() + word.slice(1);

export const getLocalizedText = (text: string | TranslatableField | null, locale: Locale): string => {
  if (!text || !Object.keys(text).length) return '';

  if (hasLocalizedFields(text)) {
    return text[locale] || text[DEFAULT_LANGUAGE];
  }

  return text as string;
};

export const getDropdownOptions = memoize(
  (dataMap: IGenericDataMap<object>, labelKey: string, locale: Locale): IDropdownOption[] => {
    return Object.values(dataMap).map((item: any) => ({
      label: hasLocalizedFields(item[labelKey]) ? getLocalizedText(item[labelKey], locale) : item[labelKey],
      value: item.id
    }));
  }
);

export const toggleItemInArray = (items: string[], item: string, shouldAddItem: boolean): string[] => {
  if (shouldAddItem) {
    return [...items, item];
  }

  return items.filter(current => current !== item);
};

export const isDataEnabled = (item: DataTypes, locale: Locale) => {
  const isEnabled = typeof item.isEnabled === 'boolean' ? item.isEnabled : item.isEnabled[locale];
  return item && isEnabled;
};

export const isItemEnabled = (item: IItem, city: ICity, locale: Locale) =>
  isDataEnabled(item, locale) && isDataEnabled(city, locale) && item.isApprovedByAdmin;

export const isInputHidden = (selectedLanguage: Locale, hasIntl: boolean, languageOption?: Locale) => {
  if (!languageOption) return false;

  if (hasIntl) {
    return languageOption !== selectedLanguage;
  }

  return selectedLanguage !== DEFAULT_LANGUAGE;
};

export const isAdminItemActive = (pathName: string, paths: string[]) => {
  const pathNameArr = pathName.split('/');
  return paths.some(path => {
    const pathArr = path.split('/');

    if (pathArr.length !== pathNameArr.length) {
      return false;
    }

    for (let i = 0; i < pathArr.length; i++) {

      if (pathArr[i][0] === ':') {
        continue;
      }

      if (pathArr[i] !== pathNameArr[i]) {
        return false;
      }
    }

    return true;
  });
};

export const getNewItems = (items: IItem[], state: IAppState) => items.filter(item => !getItemById(state, item.id));

export const getUserDetails = (accessTokenClaims: IAccessTokenClaims): UserDetails => {
  const { userId, userName, userRole } = accessTokenClaims;
  return {
    id: userId,
    name: userName,
    role: userRole
  };
};

export const getInitialCitiesFilters = (cities: ICity[]): CitiesFilterState =>
  cities.reduce((acc: CitiesFilterState, city) => {
    acc[city.id] = getInitialCityFilters();
    return acc;
  }, {}
);
