import { IItem, IImage } from '../../../../global-utils/typings';
import { getAdjustedIsEnabledValue, getRemovableFiles, getFilesToRemove, getInfoFromFileName, getSourceFiles } from '../methods';
import { MulterFile } from '../types';

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

  it('getRemovableFiles() should get a list of files that does not exist in the list of images', () => {
    const existingFiles = ['1.jpg', `1_S.jpg`, '2.jpg', '2_S.jpg', '3.jpg'];
    const newImages: IImage[] = [
      {
        id: '2',
        fileName: '2.jpg',
        thumbName: '2_S.jpg'
      }
    ];

    expect(getRemovableFiles(existingFiles, newImages, 'path')).toEqual(['path/1.jpg', 'path/1_S.jpg', 'path/3.jpg']);
  });

  it('getFilesToRemove() should get a list of uploaded files to be removed', () => {
    const existingFiles = ['1.jpg', '1_S.jpg', '2.png', '2_S.png', '3.jpg'];
    const newFiles = [
      {
        filename: '1.jpg'
      },
      {
        filename: '2.png'
      }
    ] as MulterFile[];

    expect(getFilesToRemove(existingFiles, newFiles, 'path')).toEqual([
      'path/1.jpg',
      'path/1_S.jpg',
      'path/2.png',
      'path/2_S.png'
    ]);
  });

  it('getInfoFromFileName() should get image image name, size and extension from fileName', () => {
    expect(getInfoFromFileName('image.jpg')).toEqual({
      name: 'image',
      size: null,
      extension: 'jpg'
    });

    expect(getInfoFromFileName('im. asfd  age_S.png')).toEqual({
      name: 'im. asfd  age',
      size: 'S',
      extension: 'png'
    });

    expect(getInfoFromFileName('Imag_S age_L.png')).toEqual({
      name: 'Imag_S age',
      size: 'L',
      extension: 'png'
    });
  });

  it('getSourceFiles()', () => {
    expect(getSourceFiles(['1.jpg', '1_S.jpg', '2.png', '2_S.png'])).toEqual(['1.jpg', '2.png']);
  });
});
