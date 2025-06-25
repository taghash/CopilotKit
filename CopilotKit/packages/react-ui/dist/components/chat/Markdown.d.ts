import * as react_jsx_runtime from 'react/jsx-runtime';

type Components = {
    [key: string]: React.ElementType;
};
type MarkdownProps = {
    content: string;
    components?: Components;
};
declare const Markdown: ({ content, components }: MarkdownProps) => react_jsx_runtime.JSX.Element;

export { Markdown };
