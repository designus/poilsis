import * as JWT from 'jwt-decode';
import { UserRoles, IAccessTokenClaims, IItem, IItemDescFields, TranslatableField, Locale } from './typings';
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

export const isAdmin = (userRole?: UserRoles) => userRole === UserRoles.admin;

export const voidFn = (f: any) => f;

export const getAccessTokenClaims = (token: string): IAccessTokenClaims => JWT(token);

export function hasLocalizedFields(field: TranslatableField | string): field is TranslatableField {
  if (field && typeof field === 'string') return false;

  return field ? Object.keys(field).some((field => LANGUAGES.indexOf(field as Locale) !== -1)) : false;
}

export const isFunction = (fn: any) => typeof fn === 'function';

export const callFn = (fn: any, ...args: any[]) => {
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

export const removeDuplicates = (item: any, i: number, arr: any[]) => arr.indexOf(item) === i;

export const formatValue = (value: string): string =>
  AsciiFolder.foldReplacing(value)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .join('-')
    .toLowerCase();

export const isServer = () => !(typeof window !== 'undefined' && window.document);

export const isClient = () => !isServer();

export const isNumber = (val: number | null): val is number => typeof val === 'number';

export const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
