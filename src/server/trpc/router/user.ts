import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUserId: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.id as string;
  }),
});
