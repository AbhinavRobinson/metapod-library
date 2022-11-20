import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { trpc } from "../../src/utils/trpc";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { refetch, data } = trpc.user.getBlogs.useQuery();
  const { refetch: refetchPermissions, data: isWriter } =
    trpc.user.isWriter.useQuery();

  useEffect(() => {
    if (sessionData?.user?.id) {
      refetch();
      refetchPermissions();
    }
  }, [refetch, sessionData?.user?.id]);
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {!sessionData && (
        <p className="text-xl text-sky-100">Welcome to Metapod</p>
      )}
      {sessionData && (
        <p className="text-xl text-sky-100">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      <button
        className="rounded-md border px-3 py-2 text-xl text-white"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>

      {isWriter && (
        <Link href="/blog/create">
          <span className="px-3 py-2 text-xl uppercase text-blue-700">
            Create
          </span>
        </Link>
      )}

      {data?.map((blog, i) => (
        <div key={blog.id}>
          {i} --- {blog.title} --- {blog.content} ---{" "}
          {blog.createdAt.toTimeString()}
        </div>
      ))}
    </div>
  );
};

export default AuthShowcase;
