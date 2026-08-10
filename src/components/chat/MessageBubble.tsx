"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { GlassChatBubble } from "@/components/glass/GlassChatBubble";

export interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

export function MessageBubble({
  role,
  content,
  citations,
}: {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[] | null;
}) {
  return (
    <div className={`flex flex-col ${role === "user" ? "items-end" : "items-start"}`}>
      <GlassChatBubble role={role}>
        {role === "assistant" ? (
          <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:text-ink-primary prose-p:text-ink-primary">
            <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </GlassChatBubble>
      {citations && citations.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {citations.map((c) => (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-surface rounded-full px-3 py-1 text-xs text-ink-secondary hover:text-accent-primary"
            >
              {c.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
