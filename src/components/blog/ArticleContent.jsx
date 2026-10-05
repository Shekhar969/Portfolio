import { isValidElement, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { cn, isExternalUrl } from "../../lib/utils";

// Flatten React children (highlight.js produces nested spans) into plain text.
function nodeText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) return nodeText(node.props.children);
  return "";
}

function getLanguage(children) {
  const className = isValidElement(children) ? children.props.className || "" : "";
  const match = /language-([\w-]+)/.exec(className);
  return match ? match[1] : "";
}

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const language = getLanguage(children);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(nodeText(children).replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="not-prose group relative my-6">
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-border bg-muted px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            copied ? "text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {copied ? (
            <Check size={13} aria-hidden="true" />
          ) : (
            <Copy size={13} aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <span role="status" className="sr-only">
          {copied ? "Code copied to clipboard" : ""}
        </span>
      </div>
      <pre className="overflow-x-auto rounded-b-md border border-border bg-card p-4 text-[13px] leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

const components = {
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  a: ({ href = "", children }) => {
    const external = isExternalUrl(href);
    return (
      <a
        href={href}
        {...(external && !href.startsWith("mailto:")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => (
    <img src={src} alt={alt || ""} loading="lazy" decoding="async" className="rounded-md" />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
};

export default function ArticleContent({ content }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSanitize,
          rehypeSlug,
          [rehypeHighlight, { detect: false, ignoreMissing: true }],
        ]}
        components={components}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}