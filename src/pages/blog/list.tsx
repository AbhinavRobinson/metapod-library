import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";

const List: React.FC = () => {
  const { push } = useRouter();

  const { status, data: isWriter } = trpc.user.isWriter.useQuery();
  const { data, refetch } = trpc.user.getAllBlogs.useQuery();

  if (status === "success" && !isWriter) {
    push("/404");
  }

  useEffect(() => {
    if (status === "success") {
      refetch();
    }
  }, [status]);

  return (
    <>
      {isWriter && (
        <>
          <div className="flex flex-col items-center justify-center gap-2">
            {data?.map((elem) => {
              return (
                <div key={elem.id}>
                  {elem.title} --- {elem.author.name} ---{" "}
                  {elem.createdAt.toTimeString()} ---- Published:
                  {elem.published.toString()}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default List;
