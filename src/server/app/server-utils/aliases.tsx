import { NextFunction } from 'express';
import { TranslatableField, Locale, DataTypes, LANGUAGES, IntlSetting } from 'global-utils';
import { formatValue } from 'global-utils/methods';

export const getAdjustedAliasValue = (item: DataTypes, languages: Locale[], next: NextFunction): TranslatableField | void => {
  try {
    return languages.reduce<TranslatableField>((acc, locale) => {
      const alias = item.alias as TranslatableField;
      const name = item.name as TranslatableField;

      const newAlias = alias && alias[locale] ? alias[locale] : name[locale];
      acc[locale] = newAlias ? formatValue(newAlias) : '';
      return acc;
    }, {} as TranslatableField);
  } catch (err) {
    return next(err);
  }
};

export const extendAliasWithId = (newAlias: TranslatableField, id: string, existingAliases: string[]): TranslatableField => {
  return Object.entries(newAlias).reduce<TranslatableField>((acc, item) => {
    const [locale, value] = item as [Locale, string];
    acc[locale] = value && existingAliases.includes(value) ? `${value}-${id}` : value;
    return acc;
  }, {} as TranslatableField);
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
    .reduce((acc: string[], val: any[]) => acc.concat(val), []);
}

export function getUniqueAlias<T extends DataTypes[]>(items: T, ownItemId: string, alias: TranslatableField): TranslatableField {
  const existingAliases = getAliasList(items, ownItemId);
  return existingAliases.length > 0
    ? extendAliasWithId(alias, ownItemId, existingAliases)
    : alias;
}
