import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const userId = session?.user?.id;

  // store id as a cookie to identify unique page views (dumb views)
  useEffect(() => {
    if (typeof userId === "string" && userId.length > 0)
      localStorage.setItem("userId", userId);
  }, [userId]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
