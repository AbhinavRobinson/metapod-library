import { type NextApiRequest, type NextApiResponse } from "next";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

enum Permission {
  Read = "read",
  Comment = "comment",
  Like = "like",
  Write = "write",
  Sudo = "sudo",
}
enum ExecutionLevel {
  Public = "public",
  LoggedIn = "logged-in",
  Author = "author",
  Admin = "admin",
}

const adminEmails = [
  "8.aniket.chowdhury@gmail.com",
  "abhinavrobinson@gmail.com",
];

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    if (adminEmails.includes(session?.user?.email!)) {
      const permissions = [
        {
          name: Permission.Read,
          executionLevel: ExecutionLevel.Public,
        },
        {
          name: Permission.Comment,
          executionLevel: ExecutionLevel.LoggedIn,
        },
        {
          name: Permission.Like,
          executionLevel: ExecutionLevel.LoggedIn,
        },
        {
          name: Permission.Write,
          executionLevel: ExecutionLevel.Author,
        },
        {
          name: Permission.Sudo,
          executionLevel: ExecutionLevel.Admin,
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
    }
    const perm = await prisma.permissions.findFirst({
      where: {
        name: Permission.Sudo,
      },
    });
    for (let index = 0; index < adminEmails.length; index++) {
      const element = adminEmails[index];
      await prisma.user.update({
        where: {
          email: element,
        },
        data: {
          permissions: {
            connect: {
              id: perm?.id,
            },
          },
        },
      });
    }
    res.send({
      content: await prisma.permissions.findMany(),
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};

export default restricted;
