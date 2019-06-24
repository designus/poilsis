import { localizeDocument } from '../methods';

describe('Global methods', () => {
  it('localizeDocument() should return localized string', () => {
    const item = {
      _id: 123,
      title: {
        en: 'This is title',
        lt: 'Tai yra pavadinimas'
      },
      message: {
        en: 'This is message',
        lt: 'Tai yra aprasymas'
      }
    };

    const expectation = {
      title: 'This is title',
      message: 'This is message'
    };

    expect(localizeDocument(item, 'en')).toEqual(expectation);
  });
});
