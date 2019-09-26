import { TranslatableField, DataTypes } from 'global-utils/typings';
import { extendAliasWithId, getUniqueAlias } from '../methods';
import { extend } from 'dayjs';

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

    it('getUniqueAlias() should adjust duplicated alias to include unique id', () => {
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

      const duplicatedAlias = {
        en: 'hotel-xxx'
      };

      const uniqueAlias = {
        en: 'apartments-in-paris'
      };

      expect(getUniqueAlias(items, '789', duplicatedAlias)).toEqual({ en: 'hotel-xxx-789' });
      expect(getUniqueAlias(items, '789', uniqueAlias)).toEqual(uniqueAlias);
    });
  });
});
