import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import { RenderingEngine } from "../../../components/RenderingEngine";

// get server side props
export const getServerSideProps: GetServerSideProps<
  { data: string; status: boolean },
  { id: string }
> = async (context) => {
  const params = context.params;
  const res = await fetch(
    new URL(`/blogs/${params?.id}.md`, process.env.NEXTAUTH_URL)
  );

  return {
    props: {
      data: res.status === 200 ? await res.text() : "",
      status: res.status === 200,
    },
  };
};

const Blog: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data, status }) => {
  return (
    <>
      {status && (
        <div className="p grid place-content-center">
          <RenderingEngine markdown={data} />
        </div>
      )}
      {!status && (
        <div className="prose">
          <h1>Blog with name not found.</h1>
        </div>
      )}
    </>
  );
};

export default Blog;
