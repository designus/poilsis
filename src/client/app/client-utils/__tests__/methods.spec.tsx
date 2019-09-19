import { IItem } from 'global-utils/typings';
import { getNormalizedData } from '../methods';

describe('client-utils/methods', () => {
  it('getNormalizedData()', () => {
    const mockedItem: Pick<IItem, 'id' | 'alias'> = {
      id: '123',
      alias: {
        lt: 'lt-almuka',
        en: 'en-almuka',
        ru: 'ru-almuka'
      }
    };

    const mockedItems = [mockedItem] as IItem[];

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
});
