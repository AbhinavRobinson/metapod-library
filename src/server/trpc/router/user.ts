import { ExecutionLevel, Permission } from "../../../env/commons";
import {
  adminOrWriterProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../trpc";

export const userRouter = router({
  isWriter: protectedProcedure.query(isWriter()),
  getBlogs: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user?.id.length)
      return (
        (await prisma?.blog.findMany({
          where: { authorId: ctx.session?.user?.id, published: true },
        })) ?? []
      );

    return [];
  }),
  getAllBlogs: adminOrWriterProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user?.id.length)
      return (
        (await prisma?.blog.findMany({
          where: {},
          include: { author: true, editors: true },
        })) ?? []
      );

    return [];
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
