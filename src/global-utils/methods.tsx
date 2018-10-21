import { UserRoles } from './typings';

export const mapMimeTypesToTypes = (mimeTypes: string[]) => mimeTypes.map(mimeType => mimeType.split('/')[1]).join(',');
export const isAdmin = (userRole: string) => userRole === UserRoles.admin;
export const voidFn = f => f;
