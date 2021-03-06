export const testData = {
  collections: {
    cities: [
      {
        name : 'Palanga',
        description : '',
        types: ['dogPzIz8', 'sYrnfYEv', 'a4vhAoFG', 'hwX6aOr7'],
        alias : 'palanga',
        id : 'eWRhpRV'
      },
      {
        name : 'Sventoji',
        description : '',
        types: ['dogPzIz8', 'sYrnfYEv', 'a4vhAoFG', 'hwX6aOr7'],
        alias : 'sventoji',
        id : 'a3lkp4z'
      }
    ],
    users: [
      {
        name: 'testAdmin',
        role: 'admin',
        username: 'testAdmin',
        password: '$2y$06$oDslKUil8Dw/MH0loVT8POXWWOlgPuuv96SIWr/OY/.24uyaRO6HW',
        id: 'a4Cs84LozK'
      },
      {
        name: 'testUser',
        role: 'user',
        username: 'testUser',
        password: '$2y$06$nWyP3pvpUVejTDd8IogNNO1FE4unGR0HvGWWS3aMF/tWz9xvJshYW',
        id: 'jLw5lp92c'
      }
    ],
    items: [
      {
        name: 'Almuka',
        description: '',
        types: ['sYrnfYEv', 'dogPzIz8', 'a4vhAoFG'],
        alias: 'Almuka',
        id: 'almuka',
        address: 'Geliu a.12',
        images: [
          {
              fileName: '31515184205099.jpeg',
              path: 'testUploads/items/almuka',
              thumbName: '31515184205099_S.jpeg',
              id: 'a1'
          },
          {
              fileName: 'maxresdefault1515184205125.jpeg',
              path: 'testUploads/items/almuka',
              thumbName: 'maxresdefault1515184205125_S.jpeg',
              id: 'a2'
          },
          {
              fileName: 'DSC001691520884534616.jpeg',
              path: 'testUploads/items/almuka',
              thumbName: 'DSC001691520884534616_S.jpeg',
              id: 'a3'
          }
        ],
        userId: 'a4Cs84LozK',
        cityId: 'eWRhpRV',
        isEnabled: true
      },
      {
        name: 'Po kaštonu2',
        description: '',
        types: ['sYrnfYEv', 'dogPzIz8'],
        alias: 'Po kaštonu2',
        id: 'pokastonu',
        address: 'abc',
        images: [
          {
            fileName: '31517601029329.jpeg',
            path: 'testUploads/items/pokastonu',
            thumbName: '31517601029329_S.jpeg',
            id: 'p1'
          }
        ],
        userId: 'jLw5lp92c',
        cityId: 'a3lkp4z',
        isEnabled: true
      }
    ]
  }
};
