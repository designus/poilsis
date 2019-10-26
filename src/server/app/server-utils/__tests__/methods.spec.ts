import { IItem } from '../../../../global-utils/typings';
import { getAdjustedIsEnabledValue } from '../methods';

describe('server-utils/methods', () => {
  it('getAdjustedIsEnabledValue() should set isEnabled field to false if name field is empty', () => {
    const item = {
      name: {
        lt: '',
        en: 'Some name'
      },
      isEnabled: {
        lt: true,
        en: true
      }
    } as IItem;

    expect(getAdjustedIsEnabledValue(item)).toEqual({
      lt: false,
      en: true
    });
  });
});
