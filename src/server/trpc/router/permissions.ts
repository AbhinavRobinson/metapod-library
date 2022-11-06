import { publicProcedure, router } from "../trpc";
import { prisma } from "../../db/client";

export const permissionsRouter = router({
  initialize: publicProcedure.query(async ({ ctx }) => {
    const permissions = [
      {
        name: "read",
        executionLevel: "public",
      },
    ];

    await Promise.all(
      permissions.map(async (permission) => {
        const perm = await prisma.permissions.findFirst({
          where: {
            name: permission.name,
          },
        });
        if (!perm) {
          await prisma.permissions.create({
            data: permission,
          });
        }
      })
    );
  }),
});
