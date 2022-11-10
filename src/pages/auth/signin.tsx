import { getProviders, signIn, useSession } from "next-auth/react";
import type { InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(providers);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <>
      <section className="grid min-h-screen w-full place-content-center gap-2 bg-black text-center text-white">
        Login to Metapod
        <div
          className="cursor-pointer rounded border px-3 py-2 text-lg"
          onClick={() => signIn(providers?.google.id)}
        >
          Sign in with Google
        </div>
      </section>
    </>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
