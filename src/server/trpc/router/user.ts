import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { ExecutionLevel, Permission } from "../../../env/commons";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  isWriter: protectedProcedure.query(isWriter()),
  getBlogs: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user?.id.length)
      return prisma?.blog.findMany({
        where: { authorId: ctx.session?.user?.id },
      });
    return null;
  }),
});

function isWriter() {
  return async ({ ctx }: any) => {
    if (ctx.session?.user?.id.length)
      return (
        (
          (await prisma?.permissions.findMany({
            where: {
              user: {
                some: {
                  id: ctx.session.user.id,
                },
              },
              name: { in: [Permission.Write, Permission.Sudo] },
              executionLevel: {
                in: [ExecutionLevel.Admin, ExecutionLevel.Author],
              },
            },
          })) || []
        ).length > 0
      );
    return false;
  };
}
