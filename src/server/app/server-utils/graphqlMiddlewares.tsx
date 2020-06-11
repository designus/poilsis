import { MiddlewareFn } from 'type-graphql';
import { Context } from 'server-utils';

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
