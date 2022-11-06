import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.example.findMany();
  console.log(
    await prisma.user.findFirst({
      where: {
        email: "8.aniket.chowdhury@gmail.com",
      },
    })
  );
  res.status(200).json(examples);
};

export default examples;
