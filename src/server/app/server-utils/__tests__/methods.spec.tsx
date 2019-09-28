import { DataTypes } from 'global-utils/typings';
import { extendAliasWithId, getAlias, getUniqueAlias, formatAlias } from '../methods';

describe('server-utils/methods', () => {
  describe('Aliases', () => {
    it('extendAliasWithId() should append id to the end of the alias if alias already exists', () => {
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

    it('getAlias()', () => {
      const itemWithEmptyAlias = {
        id: '123',
        alias: {
          en: ''
        },
        name: {
          en: 'Custom name'
        }
      } as DataTypes;

      const itemWithFilledAlias = {
        ...itemWithEmptyAlias,
        alias: {
          en: 'Custom   Alias'
        }
      };

      expect(getAlias(itemWithEmptyAlias)).toEqual({ en: 'custom-name' });
      expect(getAlias(itemWithFilledAlias)).toEqual({ en: 'custom-alias' });
    });

    it('formatAlias()', () => {
      expect(formatAlias('kambarių ...,, nuoma Palangoje')).toBe('kambariu-nuoma-palangoje');
      expect(formatAlias('% svečių | namai   ----. nidoje 1')).toBe('sveciu-namai-nidoje-1');
    });
  });
});
