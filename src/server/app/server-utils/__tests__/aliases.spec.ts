import { DataTypes } from '../../../../global-utils/typings';
import { extendAliasWithId, getAlias, getUniqueAlias, getAliasList, formatAlias, extendAliasWithLocale } from '../aliases';

describe('server-utils/methods', () => {
  describe('Aliases', () => {
    it('extendAliasWithId() should add id to the end of the alias if alias already exists in other items', () => {
      const alias = {
        en: 'name',
        lt: 'pavadinimas'
      };

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
      };

      const uniqueAlias = {
        en: 'apartments-in-paris'
      };

      expect(getUniqueAlias(items, '789', existingAlias)).toEqual({ en: 'hotel-xxx-789' });
      expect(getUniqueAlias(items, '789', uniqueAlias)).toEqual(uniqueAlias);
    });

    describe('getAlias()', () => {
      it('should handle all cases when name and alias are unique', () => {
        const languages = ['en'];
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

        expect(getAlias(itemWithEmptyAlias, languages)).toEqual({ en: 'custom-name' });
        expect(getAlias(itemWithFilledAlias, languages)).toEqual({ en: 'custom-alias' });
        expect(getAlias(itemWithoutAlias, languages)).toEqual({ en: 'custom-name' });
      });

      it('should handle all cases when name and alias are not unique', () => {
        const languages = ['en', 'lt'];
        const itemWithEmptyAlias = {
          id: '123',
          name: {
            en: 'Custom name',
            lt: 'Custom name'
          },
          alias: {
            en: '',
            lt: ''
          }
        } as DataTypes;

        const itemWithFilledAlias = {
          id: '123',
          name: {
            en: 'Custom name',
            lt: 'Custom name'
          },
          alias: {
            en: 'Custom   Alias',
            lt: 'Custom   Alias'
          }
        } as DataTypes;

        const itemWithoutAlias = {
          id: '123',
          name: {
            en: 'Custom name',
            lt: 'Custom name'
          }
        } as DataTypes;

        expect(getAlias(itemWithEmptyAlias, languages)).toEqual({
          en: 'custom-name-en',
          lt: 'custom-name-lt'
        });

        expect(getAlias(itemWithFilledAlias, languages)).toEqual({
          en: 'custom-alias-en',
          lt: 'custom-alias-lt'
        });

        expect(getAlias(itemWithoutAlias, languages)).toEqual({
          en: 'custom-name-en',
          lt: 'custom-name-lt'
        });

      });

    });

    it('formatAlias()', () => {
      expect(formatAlias('kambarių ...,, nuoma Palangoje')).toBe('kambariu-nuoma-palangoje');
      expect(formatAlias('% svečių | namai   ----. nidoje 1')).toBe('sveciu-namai-nidoje-1');
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

    it('extendAliasWithLocale() should add locale if alias already exists in same item but other locales', () => {
      const aliasValue = 'alias';
      const locale = 'lt';

      const aliasWithUniqueValues = {
        en: 'alias-en',
        lt: 'alias'
      };

      expect(extendAliasWithLocale(aliasValue, aliasWithUniqueValues, locale)).toBe('alias');

      const aliasWithDuplicatedValues = {
        en: 'alias',
        lt: 'alias'
      };

      expect(extendAliasWithLocale(aliasValue, aliasWithDuplicatedValues, locale)).toBe('alias-lt');
    });
  });
});
