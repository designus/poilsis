import * as JWT from 'jwt-decode';
import { MongooseDocument } from 'mongoose';
import { UserRoles, IAccessTokenClaims } from './typings';
import { LANGUAGES } from './constants';

export const mapMimeTypesToTypes = (mimeTypes: string[]) => mimeTypes.map(mimeType => mimeType.split('/')[1]).join(', ');
export const isAdmin = (userRole: string) => userRole === UserRoles.admin;
export const voidFn = f => f;

export const getAccessTokenClaims = (token: string): IAccessTokenClaims => JWT(token);

export const hasLocalizedFields = (field) => Object.keys(field).some(field => LANGUAGES.indexOf(field) !== -1);

export const localizeDocument = (document: MongooseDocument, language: string) => {
  const item = document.toObject();
  return Object.keys(item).reduce((acc: any, key: string) => {
    if (key === '_id') {
      return acc;
    }

    const field = item[key];
    acc[key] = hasLocalizedFields(field) ? field[language] : field;

    return acc;
  }, {});
};

export const getLocalizedResponse = (data: any, language: string) => {
  return data.constructor === Array
    ? data.map(document => localizeDocument(document, language))
    : localizeDocument(data, language);
};
