import * as JWT from 'jwt-decode';
import { UserRoles, IAccessTokenClaims, IItem, IItemDescFields, TranslatableField, Languages } from './typings';
import { LANGUAGES } from './constants';

const AsciiFolder = require('fold-to-ascii');

// Memoize this function
export const mapMimeTypesToTypes = (mimeTypes: string[]) =>
  mimeTypes.map(mimeType => mimeType.split('/')[1]).join(', ');

export const isDevelopment = process.env.NODE_ENV === 'development';

export const getStaticFileUri = (file: string): string => {
  if (typeof window !== 'undefined') {
    return file;
  }
  return `${isDevelopment ? 'http://localhost:8080' : ''}/public/${file}`;
};

export const isAdmin = (userRole: UserRoles) => userRole === UserRoles.admin;

export const voidFn = f => f;

export const getAccessTokenClaims = (token: string): IAccessTokenClaims => JWT(token);

export const hasLocalizedFields = (field: TranslatableField | string) =>
  field && Object.keys(field).some((field: Languages) => LANGUAGES.indexOf(field) !== -1);

export const isFunction = fn => typeof fn === 'function';

export const callFn = (fn, ...args) => {
  if (isFunction(fn)) {
    fn.apply(null, args);
  }
};

export const getTranslationMessages = (locale: string) => require(`../translations/${locale}.json`);

export const getItemDescriptionFields = (item: IItem): IItemDescFields => {
  const { description, metaTitle, metaDescription  } = item;
  return {
    description,
    metaTitle,
    metaDescription
  };
};

export const removeDuplicates = (item, i, arr) => arr.indexOf(item) === i;

export const formatValue = (value: string): string =>
  AsciiFolder.foldReplacing(value)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .join('-')
    .toLowerCase();

export const isServer = () => !(typeof window !== 'undefined' && window.document);

export const isClient = () => !isServer();
