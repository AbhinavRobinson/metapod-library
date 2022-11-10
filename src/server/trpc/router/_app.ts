import { router } from "../trpc";
import { authRouter } from "./auth";
import { blogRouter } from "./blog";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  blog: blogRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
