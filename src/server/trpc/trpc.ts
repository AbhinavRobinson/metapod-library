import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ExecutionLevel, Permission } from "../../env/commons";
import { prisma } from "../../server/db/client";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

import type { Prisma } from "@prisma/client";
const withPermissions = ({
  validPermissions,
}: {
  validPermissions: Prisma.Enumerable<Prisma.PermissionsWhereInput>;
}) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: ctx.session.user.email,
      },
    });

    const perms = await prisma.permissions.findMany({
      where: {
        OR: validPermissions,
      },
    });

    const commons = perms
      .map((perm) => perm.id.toString())
      .filter((value) =>
        user?.permissionIds.map((u) => u.toString()).includes(value)
      );

    if (commons.length === 0) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

export const adminOrWriterProcedure = t.procedure.use(
  withPermissions({
    validPermissions: [
      {
        executionLevel: ExecutionLevel.Admin,
      },
      {
        name: Permission.Write,
      },
    ],
  })
);
