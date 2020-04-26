import { Item } from 'data-models';
import { getNormalizedData, isAdminItemActive } from '../methods';

describe('client-utils/methods', () => {
  it('getNormalizedData()', () => {
    const mockedItem: Pick<Item, 'id' | 'alias'> = {
      id: '123',
      alias: {
        lt: 'lt-almuka',
        en: 'en-almuka',
        ru: 'ru-almuka'
      }
    };

    const mockedItems = [mockedItem] as Item[];

    expect(getNormalizedData(mockedItems)).toEqual({
      dataMap: {
        123: mockedItem
      },
      aliases: {
        'lt-almuka': '123',
        'en-almuka': '123',
        'ru-almuka': '123'
      }
    });
  });

  it('isAdminItemActive()', () => {
    const activePaths = [
      '/admin/item/edit/:itemId/:userId/main',
      '/admin/item/edit/:itemId/:userId/description',
      '/admin/items'
    ];

    expect(isAdminItemActive('/admin/item/edit/1234/567/main', activePaths)).toBe(true);
    expect(isAdminItemActive('/admin/item/edit/afasf/sl4px/description', activePaths)).toBe(true);
    expect(isAdminItemActive('/admin/items', activePaths)).toBe(true);
    expect(isAdminItemActive('/admin/some-other-path/items', activePaths)).toBe(false);
  });
});
