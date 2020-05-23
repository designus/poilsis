import { Request, Response } from 'express';
import { AuthChecker } from 'type-graphql';
import { UserRoles } from 'global-utils/typings';
import { auth } from '../controllers';

type Context = {
  req: Request;
  res: Response;
};

export const authChecker: AuthChecker<Context, UserRoles> = async (resolverData, roles) => {
  try {
    const { context } = resolverData;

    await auth.authenticatePromise(context.req, context.res);

    const user = auth.getAccessTokenClaims(context.req);

    if (roles.length === 0) {
      return Boolean(user);
    }

    if (user.userRole === UserRoles.admin) {
      return true;
    }

    if (user.userRole === UserRoles.user) {
      return roles.includes(user.userRole) && user.userItems.includes(resolverData.args.id);
    }

    return false;

  } catch (err) {
    return false;
  }
};
