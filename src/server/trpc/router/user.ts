import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  createBlog: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const blog: Prisma.BlogCreateInput = {
        title: input.title,
        content: input.content,
        author: {
          connect: {
            id: ctx.session?.user?.id,
          },
        },
        visits: {
          connect: {
            id: ctx.session?.user?.id,
          },
        },
      };
      return prisma?.blog.create({ data: blog });
    }),
  getBlogs: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user?.id.length)
      return prisma?.blog.findMany({
        where: { authorId: ctx.session?.user?.id },
      });
    return null;
  }),
});
