import { FC, memo } from "react";
import ReactMarkdown from "react-markdown"; // Removed Options and Components
import { CodeBlock } from "./CodeBlock";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { ReactNode } from "react"; // Import ReactNode

// Define a basic type for Components based on usage
type Components = {
  [key: string]: React.ElementType;
};

// Define types for common props
type MarkdownElementProps = {
  children?: ReactNode;
  className?: string;
  [key: string]: any; // Allow other props
};

type CodeProps = {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
  [key: string]: any; // Allow other props
};


const defaultComponents: Components = {
  a({ children, ...props }: MarkdownElementProps) { // Added type
    return (
      <a className="copilotKitMarkdownElement" {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  code({ children, className, inline, ...props }: CodeProps) { // Added type
    const codeContent = String(children);

    if (codeContent === "▍") {
      return (
        <span
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            marginTop: "0.25rem",
          }}
        >
          ▍
        </span>
      );
    }

    const match = /language-(\w+)/.exec(className || "");

    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <CodeBlock
        key={Math.random()}
        language={(match && match[1]) || ""}
        value={codeContent.replace(/\n$/, "")}
        {...props}
      />
    );
  },
  h1: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <h1 className="copilotKitMarkdownElement" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <h2 className="copilotKitMarkdownElement" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <h3 className="copilotKitMarkdownElement" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <h4 className="copilotKitMarkdownElement" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <h5 className="copilotKitMarkdownElement" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <h6 className="copilotKitMarkdownElement" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <p className="copilotKitMarkdownElement" {...props}>
      {children}
    </p>
  ),
  pre: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <pre className="copilotKitMarkdownElement" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <blockquote className="copilotKitMarkdownElement" {...props}>
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <ul className="copilotKitMarkdownElement" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: MarkdownElementProps) => ( // Added type
    <li className="copilotKitMarkdownElement" {...props}>
      {children}
    </li>
  ),
};

const MemoizedReactMarkdown: FC<any> = memo( // Changed Options to any for now
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && prevProps.components === nextProps.components,
);

type MarkdownProps = {
  content: string;
  components?: Components;
};

export const Markdown = ({ content, components }: MarkdownProps) => {
  return (
    <div className="copilotKitMarkdown">
      <MemoizedReactMarkdown
        components={{ ...defaultComponents, ...components }}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </MemoizedReactMarkdown>
    </div>
  );
};
