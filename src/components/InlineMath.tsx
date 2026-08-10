import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** Renders Markdown+LaTeX inline — safe to nest inside <p>, <span>, <li>,
 * <button>, etc. ReactMarkdown wraps its output in <p> by default, which is
 * invalid inside inline/list contexts and causes a real bug: the browser
 * auto-closes the surrounding tag to fix the invalid nesting, so server and
 * client render different DOM trees and hydration fails. Overriding the p
 * renderer to a fragment avoids that entirely. */
export function InlineMath({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{ p: ({ children }) => <>{children}</> }}
      >
        {text}
      </ReactMarkdown>
    </span>
  );
}
