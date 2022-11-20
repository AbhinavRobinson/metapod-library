import { adminOrWriterProcedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

export const blogRouter = router({
  createBlog: adminOrWriterProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.blog.create({
        data: {
          title: input.title,
          content: input.content,
          author: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
    }),
});
