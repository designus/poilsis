import { Locale, DataTypes, LANGUAGES } from 'global-utils';
import { TranslatableField } from 'data-models';
import { formatValue, getDefaultTranslatableField } from 'global-utils/methods';
import { Input, Model, Document } from 'server-utils/types';

export const getItemsByAliasesQuery = (aliases: string[]) => {
  const query = LANGUAGES.map(locale => ({
    [`alias.${locale}`]: { $in: aliases }
  }));

  return {
    $or: query
  };
};

export const getItemsByAlias = async (dataModel: Model, alias: TranslatableField): Promise<DataTypes[]> => {
  const aliasValues = Object.values(alias).filter(Boolean);
  const documents = await dataModel.find(getItemsByAliasesQuery(aliasValues));
  return documents.map(item => item.toJSON());
};

// TODO: remove deprecated
export const getAdjustedAliasValue = (item: DataTypes, languages: Locale[] = LANGUAGES): TranslatableField => {
  return languages.reduce<TranslatableField>((acc, locale) => {
    const alias = item.alias;
    const name = item.name;
    const newAlias = alias && alias[locale] ? alias[locale] : name[locale];
    acc[locale] = newAlias ? formatValue(newAlias) : '';
    return acc;
  }, getDefaultTranslatableField());
};

export const getFormattedAlias = (item: Input, languages: Locale[] = LANGUAGES): TranslatableField => {
  return languages.reduce<TranslatableField>((acc, locale) => {
    const alias = item.alias;
    const name = item.name;
    const newAlias = alias && alias[locale] ? alias[locale] : name[locale];

    acc[locale] = newAlias ? formatValue(newAlias) : '';
    return acc;
  }, getDefaultTranslatableField());
};

export const extendAliasWithId = (newAlias: TranslatableField, id: string, existingAliases: string[]): TranslatableField => {
  return Object.entries(newAlias).reduce<TranslatableField>((acc, item) => {
    const [locale, value] = item as [Locale, string];
    acc[locale] = value && existingAliases.includes(value) ? `${value}-${id}` : value;
    return acc;
  }, {} as TranslatableField);
};

export function getAliasList<T extends DataTypes[]>(items: T, ownItemId?: string): string[] {
  return items
    // we remove own item
    .filter(item => item.id !== ownItemId)
    .map(item => Object.values(item.alias))
    .reduce((acc: string[], val: any[]) => acc.concat(val), []);
}
// TODO: remove deprecated
export function getUniqueAlias<T extends DataTypes[]>(items: T, ownItemId: string, alias: TranslatableField): TranslatableField {
  const existingAliases = getAliasList(items, ownItemId);
  return existingAliases.length > 0
    ? extendAliasWithId(alias, ownItemId, existingAliases)
    : alias;
}

export function generateUniqeAlias<T extends DataTypes[]>(ownItemId: string, alias: TranslatableField, items: T): TranslatableField {
  const existingAliases = getAliasList(items, ownItemId);
  return existingAliases.length > 0
    ? extendAliasWithId(alias, ownItemId, existingAliases)
    : alias;
}

export async function getAlias<T extends Input, U extends Model>(id: string, input: T, dataModel: U) {
  const alias = getFormattedAlias(input);
  const itemsByAlias = await getItemsByAlias(dataModel, alias);
  return generateUniqeAlias(id, alias, itemsByAlias);
}
