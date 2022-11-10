import { readFileSync } from "fs";
import { InferGetServerSidePropsType } from "next";
import React from "react";
import { RenderingEngine } from "../../../components/RenderingEngine";

// get server side props
export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const res = await fetch(new URL(`/blogs/${id}.md`, process.env.NEXTAUTH_URL));

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
        <div className="grid place-content-center pt-10">
          <RenderingEngine markdown={data} />
        </div>
      )}
      {!status && (
        <div className="prose">
          <h1>404</h1>
        </div>
      )}
    </>
  );
};

export default Blog;
