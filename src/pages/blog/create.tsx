import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { RenderingEngine } from "../../../components/RenderingEngine";

export const getServerSideProps: GetServerSideProps<
  { data: string; status: boolean },
  { id: string }
> = async (context) => {
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
  const [{ markdown }, setData] = useState<{ markdown: string }>({
    markdown: data,
  });

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
      <button className="rounded-md border px-3 py-2 text-xl text-black">
        Create a Blog
      </button>
    </>
  );
};

export default Create;
