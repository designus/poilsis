import { DataTypes, TranslatableField, Locale } from '../../../../global-utils/typings';
import { extendAliasWithId, getAdjustedAliasValue, getUniqueAlias, getAliasList } from '../aliases';

describe('server-utils/aliases', () => {
  describe('Aliases', () => {
    const voidFn = () => null;

    it('extendAliasWithId() should add id to the end of the alias if alias already exists in other items', () => {
      const alias = {
        en: 'name',
        lt: 'pavadinimas'
      } as TranslatableField;

      expect(extendAliasWithId(alias, 'id123', ['name'])).toEqual({
        en: 'name-id123',
        lt: 'pavadinimas'
      });
    });

    it('getUniqueAlias()', () => {
      const items = [
        {
          id: '123',
          alias: {
            en: 'rest-in-palanga'
          }
        },
        {
          id: '456',
          alias: {
            en: 'hotel-xxx'
          }
        }
      ] as DataTypes[];

      const existingAlias = {
        en: 'hotel-xxx'
      } as TranslatableField;

      const uniqueAlias = {
        en: 'apartments-in-paris'
      } as TranslatableField;

      expect(getUniqueAlias(items, '789', existingAlias)).toEqual({ en: 'hotel-xxx-789' });
      expect(getUniqueAlias(items, '789', uniqueAlias)).toEqual(uniqueAlias);
    });

    describe('getAdjustedAliasValue()', () => {
      it('should handle all cases when name and alias are unique', () => {
        const languages = ['en'] as Locale[];
        const itemWithEmptyAlias = {
          id: '123',
          name: {
            en: 'Custom name'
          },
          alias: {
            en: ''
          }
        } as DataTypes;

        const itemWithFilledAlias = {
          id: '123',
          name: {
            en: 'Custom name'
          },
          alias: {
            en: 'Custom   Alias'
          }
        } as DataTypes;

        const itemWithoutAlias = {
          id: '123',
          name: {
            en: 'Custom name'
          }
        } as DataTypes;

        expect(getAdjustedAliasValue(itemWithEmptyAlias, languages, voidFn)).toEqual({ en: 'custom-name' });
        expect(getAdjustedAliasValue(itemWithFilledAlias, languages, voidFn)).toEqual({ en: 'custom-alias' });
        expect(getAdjustedAliasValue(itemWithoutAlias, languages, voidFn)).toEqual({ en: 'custom-name' });
      });

      it('should not add alias if name field is empty', () => {
        const languages = ['en', 'lt', 'ru'] as Locale[];
        const itemWithEmptyName = {
          id: '123',
          name: {
            en: 'Custom name',
            lt: '',
            ru: ''
          },
          alias: {
            en: '',
            lt: '',
            ru: ''
          }
        } as DataTypes;

        expect(getAdjustedAliasValue(itemWithEmptyName, languages, voidFn)).toEqual({
          en: 'custom-name',
          lt: '',
          ru: ''
        });
      });

    });

    it('getAliasList()', () => {
      const items = [
        {
          id: '123',
          alias: {
            en: '123-alias-en',
            lt: '123-alias-lt'
          }
        },
        {
          id: '345',
          alias: {
            en: '345-alias-en',
            lt: '345-alias-lt'
          }
        }
      ] as DataTypes[];

      expect(getAliasList(items, undefined)).toEqual(['123-alias-en', '123-alias-lt', '345-alias-en', '345-alias-lt']);
      expect(getAliasList(items, '123')).toEqual(['345-alias-en', '345-alias-lt']);
    });
  });
});
