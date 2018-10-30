import * as JWT from 'jwt-decode';
import { UserRoles, IAccessTokenClaims } from './typings';
import { LANGUAGES } from './constants';

export const mapMimeTypesToTypes = (mimeTypes: string[]) => mimeTypes.map(mimeType => mimeType.split('/')[1]).join(', ');
export const isAdmin = (userRole: string) => userRole === UserRoles.admin;
export const voidFn = f => f;

export const getAccessTokenClaims = (token: string): IAccessTokenClaims => JWT(token);

export const getLocalizedResponse = <T extends {}>(list: T[], language: string) => {
  // console.log('List', list);
  return list.map(document => {
    const item = document.toObject();
    return Object.keys(item).reduce((acc: T, key: string) => {
      if (key === '_id') {
        return acc;
      }

      const field = item[key];
      const hasLocalizedFields = Object.keys(field).some(field => LANGUAGES.indexOf(field) !== -1);
      acc[key] = hasLocalizedFields ? field[language] : field;

      return acc;
    }, {});
  });
};
