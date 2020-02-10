import { UserRoles, TranslatableField, Locale } from 'global-utils/typings';
import { LANGUAGES } from 'global-utils/constants';
import { getLocalizedText } from 'client-utils/methods';

interface IClientRoutesConfig {
  login: {
    path: string,
    getLink: (locale: Locale) => string
  };
  landing: {
    path: string,
    getLink: (locale: Locale) => string
  };
  items: {
    path: string,
    getLink: (locale: Locale, cityAlias: TranslatableField | string) => string
  };
  item: {
    path: string,
    getLink: (locale: Locale, cityAlias: TranslatableField | string, itemAlias: TranslatableField | string) => string
  };
}

interface IAdminRoutesConfig {
  createItem: {
    path: string;
    getLink: () => string;
  };
  landing: {
    path: string;
    getLink: (locale: Locale) => string;
  };
  items: {
    path: string;
    getLink: () => string;
  };
  createItemMain: {
    path: string;
    getLink: () => string;
  };
  editItem: {
    path: string;
    getLink: (userId: string, itemId: string) => string;
  };
  editItemMain: {
    path: string;
    getLink: (userId: string, itemId: string) => string;
  };
  editItemDescription: {
    path: string;
    getLink: (userId: string, itemId: string) => string;
  };
  editItemPhotos: {
    path: string;
    getLink: (userId: string, itemId: string) => string;
  };
  types: {
    path: string;
    getLink: () => string;
    allowedRoles: UserRoles[]
  };
  createType: {
    path: string;
    getLink: () => string;
    allowedRoles: UserRoles[];
  };
  editType: {
    path: string;
    getLink: (typeId: string) => string;
    allowedRoles: UserRoles[];
  };
  cities: {
    path: string;
    getLink: () => string;
    allowedRoles: UserRoles[];
  };
  createCity: {
    path: string;
    getLink: () => string;
    allowedRoles: UserRoles[];
  };
  editCity: {
    path: string;
    getLink: (cityId: string) => string;
    allowedRoles: UserRoles[];
  }
}

const locales = LANGUAGES.join('|');

export const clientRoutes: IClientRoutesConfig = {
  login: {
    path: `/:locale(${locales})?/login`,
    getLink: (locale: string) => `/${locale}/login`
  },
  landing: {
    path: `/:locale(${locales})?`,
    getLink: (locale: string) => `/${locale}`
  },
  items: {
    path: `/:locale(${locales})/:cityAlias`,
    getLink: (locale, cityAlias) => `/${locale}/${getLocalizedText(cityAlias, locale)}`
  },
  item: {
    path: `/:locale(${locales})/:cityAlias/:itemAlias`,
    getLink: (locale, cityAlias, itemAlias) => `/${locale}/${getLocalizedText(cityAlias, locale)}/${getLocalizedText(itemAlias, locale)}`
  }
};

export const adminRoutes: IAdminRoutesConfig = {
  landing: {
    path: '/admin',
    getLink: () => '/admin'
  },
  items: {
    path: '/admin/items',
    getLink: () => '/admin/items'
  },
  createItem: {
    path: '/admin/item/create',
    getLink: () => '/admin/item/create'
  },
  createItemMain: {
    path: '/admin/item/create',
    getLink: () => '/admin/item/create'
  },
  editItem: {
    path: '/admin/item/edit/:userId/:itemId',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}`
  },
  editItemMain: {
    path: '/admin/item/edit/:userId/:itemId/main',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/main`
  },
  editItemDescription: {
    path: '/admin/item/edit/:userId/:itemId/description',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/description`
  },
  editItemPhotos: {
    path: '/admin/item/edit/:userId/:itemId/photos',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/photos`
  },
  types: {
    path: '/admin/types',
    getLink: () => '/admin/types',
    allowedRoles: [UserRoles.admin]
  },
  createType: {
    path: '/admin/type/create',
    getLink: () => '/admin/type/create',
    allowedRoles: [UserRoles.admin]
  },
  editType: {
    path: '/admin/type/edit/:typeId',
    getLink: (typeId) => `/admin/type/edit/${typeId}`,
    allowedRoles: [UserRoles.admin]
  },
  cities: {
    path: '/admin/cities',
    getLink: () => '/admin/cities',
    allowedRoles: [UserRoles.admin]
  },
  createCity: {
    path: '/admin/city/create',
    getLink: () => '/admin/city/create',
    allowedRoles: [UserRoles.admin]
  },
  editCity: {
    path: '/admin/city/edit/:cityId',
    getLink: (cityId) => `/admin/city/edit/${cityId}`,
    allowedRoles: [UserRoles.admin]
  }
};
