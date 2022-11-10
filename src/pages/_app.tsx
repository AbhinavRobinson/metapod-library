import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
// import { useEffect } from "react";
// import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // const router = useRouter();
  // const postVisit = trpc.user

  // useEffect(() => {
  //   if (router.asPath && session?.user?.id) {
  //   }
  // }, [router.asPath, session?.user?.id]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
