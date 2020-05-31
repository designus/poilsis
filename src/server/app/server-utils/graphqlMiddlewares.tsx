import { MiddlewareFn, ArgumentValidationError } from 'type-graphql';

export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {

    if (!(err instanceof ArgumentValidationError)) {
      // hide errors from db like printing sql query
      throw new Error('Unknown error occurred. Try again later!');
    }

    throw err;
  }
};
