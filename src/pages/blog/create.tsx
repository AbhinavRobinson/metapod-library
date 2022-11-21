import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RenderingEngine } from "../../../components/RenderingEngine";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps<
  { data: string; status: boolean },
  { id: string }
> = async () => {
  const res = await fetch(
    new URL(`/blogs/example.md`, process.env.NEXTAUTH_URL)
  );

  return {
    props: {
      data: res.status === 200 ? await res.text() : "",
      status: res.status === 200,
    },
  };
};

const Create: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
  const [{ markdown, title }, setData] = useState<{
    markdown: string;
    title: string;
  }>({
    title: "",
    markdown: data,
  });
  const { push } = useRouter();
  const { status, data: isWriter } = trpc.user.isWriter.useQuery();

  const blogs = trpc.blog.createBlog.useMutation();

  if (status === "success" && isWriter) {
    return (
      <>
        Create a blog
        <div>
          <input
            className="border-black"
            type="text"
            name="title"
            onChange={(e) => {
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
            }}
            placeholder="Title"
          />
        </div>
        <div className="flex">
          <textarea
            className="w-1/2 rounded-md border p-2"
            value={markdown}
            name="markdown"
            onChange={(e) => {
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
            }}
          />
          <RenderingEngine markdown={markdown} />
        </div>
        <button
          onClick={async () => {
            await blogs.mutateAsync({
              title: title,
              content: markdown,
            });
            push("/");
          }}
          className="rounded-md border px-3 py-2 text-xl text-black"
        >
          Create a Blog
        </button>
      </>
    );
  }
  return <>404</>;
};

export default Create;
