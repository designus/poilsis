import { MiddlewareFn, ArgumentValidationError } from 'type-graphql';
import { getUploadPath, removeDirectory, checkIfDirectoryExists, createDirectory, Context, createUploadPath } from 'server-utils';
import { Item } from 'data-models';

export const ErrorInterceptor: MiddlewareFn<Context> = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {

    // if (!(err instanceof ArgumentValidationError)) {
      // hide errors from db like printing sql query
      // throw new Error('Unknown error occurred. Try again later!');
    // }

    throw err;
  }
};

export const removeImageDirectory: MiddlewareFn<Context> = async (params, next) => {
  try {
    const id = await next();
    const uploadPath = getUploadPath(id);

    await removeDirectory(uploadPath);

    const exists = await checkIfDirectoryExists(uploadPath);

    if (exists) {
      throw new Error ('Unable to remove image directory');
    } else {
      return true;
    }
  } catch (err) {
    return next();
  }
};

export const createImageDirectory: MiddlewareFn<Context> = async (params, next) => {
  try {
    await createUploadPath(params.args.id);
    return next();
  } catch (err) {
    return next();
  }
};
