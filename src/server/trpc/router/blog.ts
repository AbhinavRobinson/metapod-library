import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
export const blogRouter = router({
  addBlog: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return {};
  }),
});
