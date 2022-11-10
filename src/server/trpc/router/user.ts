import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  logVisit: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$connect();
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
      return ctx.prisma.blog.create({ data: blog });
    }),
});
