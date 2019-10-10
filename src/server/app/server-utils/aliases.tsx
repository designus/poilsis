import { NextFunction } from 'express';
import { TranslatableField, Languages, DataTypes, LANGUAGES } from 'global-utils';

const AsciiFolder = require('fold-to-ascii');

export const formatAlias = (alias: string): string =>
  AsciiFolder.foldReplacing(alias)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .join('-')
    .toLowerCase();

export const extendAliasWithLocale = (value: string, values: TranslatableField, locale: string) => {
  const existingValues = Object.keys(values)
    .filter(key => key !== locale)
    .map(key => values[key]);

  return existingValues.includes(value) ? `${value}-${locale}` : value;
};

export const getAlias = (item: DataTypes, languages: string[], next?: NextFunction): TranslatableField | void => {
  try {
    return languages.reduce((acc, locale) => {
      const newAlias = item.alias && item.alias[locale]
        ? extendAliasWithLocale(item.alias[locale], item.alias, locale)
        : extendAliasWithLocale(item.name[locale], item.name, locale);

      acc[locale] = newAlias ? formatAlias(newAlias) : '';
      return acc;
    }, {});
  } catch (err) {
    return next(err);
  }
};

export const extendAliasWithId = (newAlias: TranslatableField, id: string, existingAliases: string[]): TranslatableField => {
  return Object.entries(newAlias).reduce((acc, [locale, value]: [Languages, string]) => {
    acc[locale] = value && existingAliases.includes(value) ? `${value}-${id}` : value;
    return acc;
  }, {});
};

export const getItemsByAliasesQuery = (aliases: string[]) => {
  const query = LANGUAGES.map(locale => ({
    [`alias.${locale}`]: { $in: aliases }
  }));

  return {
    $or: query
  };
};

export function getAliasList<T extends DataTypes[]>(items: T, ownItemId?: string): string[] {
  return items
    // we remove own item
    .filter(item => item.id !== ownItemId)
    .map(item => Object.values(item.alias))
    .reduce((acc: string[], val: string[]) => acc.concat(val), []);
}

export function getUniqueAlias<T extends DataTypes[]>(items: T, ownItemId: string, alias: TranslatableField): TranslatableField {
  const existingAliases = getAliasList(items, ownItemId);
  return existingAliases.length > 0
    ? extendAliasWithId(alias, ownItemId, existingAliases)
    : alias;
}
