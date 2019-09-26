import { TranslatableField } from 'global-utils/typings';
import { extendAliasWithId } from '../methods';

describe('server-utils/methods', () => {
  describe('Aliases', () => {
    it('extendAliasWithId() should append id to the end of the alias if alias already exists', () => {
      const id = 'id123';
      const existingAliases = ['name'];
      const alias: TranslatableField = {
        en: 'name',
        lt: 'pavadinimas'
      };

      expect(extendAliasWithId(alias, id, existingAliases)).toEqual({
        en: 'name-id123',
        lt: 'pavadinimas'
      });
    });
  });
});
