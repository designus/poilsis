import { getLocalizedResponse } from '../methods';

describe('Global methods', () => {
  it('getLocalizedResponse should return localized string', () => {
    const list = [
      {
        _id: 123,
        title: {
          en: 'This is title',
          lt: 'Tai yra pavadinimas',
        },
        message: {
          en: 'This is message',
          lt: 'Tai yra aprasymas',
        },
      },
    ];

    const expectation = [
      {
        title: 'This is title',
        message: 'This is message',
      },
    ];

    expect(getLocalizedResponse(list, 'en')).toEqual(expectation);
  });
});
