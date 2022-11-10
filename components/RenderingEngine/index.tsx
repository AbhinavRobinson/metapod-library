import ReactMarkdown from "react-markdown";

const markdown = `
# Some Blog Header

### Data Header

- data: 2019-01-01
- data: 2019-02-01
`;
export const RenderingEngine: React.FC = () => {
  return (
    <>
      <div className="prose prose-headings:underline prose-a:text-blue-600 prose-img:rounded-xl">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </>
  );
};
