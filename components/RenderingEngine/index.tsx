import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const markdown = `
# Some Blog Header

### Data Header

- data: 2019-01-01
- data: 2019-02-01

<a href="#">GoTo</a>

\`\`\`js
const a = 1;
\`\`\`

`;

export const RenderingEngine: React.FC = () => {
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
