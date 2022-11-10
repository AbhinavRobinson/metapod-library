import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export const RenderingEngine: React.FC<{ markdown: string }> = ({
  markdown,
}) => {
  return (
    <>
      <div className="prose prose-a:text-blue-600 prose-img:rounded-xl">
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </>
  );
};
