import * as JWT from 'jwt-decode';
import { UserRoles, IAccessTokenClaims, TItemFields, TItemDescFields } from './typings';
import { LANGUAGES } from './constants';

export const mapMimeTypesToTypes = (mimeTypes: string[]) =>
  mimeTypes.map(mimeType => mimeType.split('/')[1]).join(', ');

export const isDevelopment = process.env.NODE_ENV === 'development';

export const getStaticFileUri = (file: string): string => {
  if (typeof window !== 'undefined') {
    return file;
  }
  return `${isDevelopment ? 'http://localhost:8080' : ''}/public/${file}`;
};

export const isAdmin = (userRole: string) => userRole === UserRoles.admin;

export const voidFn = f => f;

export const getAccessTokenClaims = (token: string): IAccessTokenClaims => JWT(token);

export const hasLocalizedFields = (field) => field && Object.keys(field).some(field => LANGUAGES.indexOf(field) !== -1);

export const localizeDocument = (item: object, language: string) => {
  return Object.keys(item).reduce((acc: any, key: string) => {
    if (key === '_id') {
      return acc;
    }

    const field = item[key];
    acc[key] = hasLocalizedFields(field) ? field[language] : field;

    return acc;
  }, {});
};

export const isFunction = fn => typeof fn === 'function';

export const getLocalizedResponse = (data: any, language: string) => {
  const getObject = data => isFunction(data.toObject) ? data.toObject() : data;

  return data.constructor === Array ?
    data.map(document => localizeDocument(getObject(document), language)) :
    localizeDocument(getObject(data), language);
};

export const getTranslationMessages = (locale: string) => require(`../translations/${locale}.json`);

export const getItemDescriptionFields = (item: TItemFields): TItemDescFields => {
  const { description, metaTitle, metaDescription, metaKeywords  } = item;
  return {
    description,
    metaTitle,
    metaDescription,
    metaKeywords
  };
};

export const removeDuplicates = (item, i, arr) => arr.indexOf(item) === i;
