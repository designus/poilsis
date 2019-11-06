import { IItem, IImage } from '../../../../global-utils/typings';
import { getAdjustedIsEnabledValue, getRemovableFiles } from '../methods';

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

  it('getRemovableFiles() should a list of files that does not exist in the list of images', () => {
    const files = ['1.jpg', '2.jpg', '3.jpg'];
    const images: IImage[] = [
      {
        id: '2',
        fileName: '2.jpg',
        thumbName: '2_S.jpg'
      }
    ];

    expect(getRemovableFiles(files, images, 'path')).toEqual(['path/1.jpg', 'path/3.jpg']);
  });
});
