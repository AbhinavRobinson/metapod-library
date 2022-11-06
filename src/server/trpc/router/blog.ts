import { publicProcedure, router } from "../trpc";

export const blogRouter = router({
  initialize: publicProcedure.query(async ({ ctx }) => {
    return {};
  }),
});
