import React from "react";

interface FormattedMessageProps {
  text: string;
  className?: string;
}

function renderInlineFormatting(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Matches **bold**, *bold*, or _italic_
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={keyIdx++} className="font-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <strong key={keyIdx++} className="font-bold">
          {token.slice(1, -1)}
        </strong>
      );
    } else if (token.startsWith("_") && token.endsWith("_")) {
      nodes.push(
        <em key={keyIdx++} className="italic opacity-85">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(token);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [line];
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  text,
  className = "",
}) => {
  const lines = text.split("\n");

  return (
    <div className={`space-y-1.5 leading-relaxed ${className}`}>
      {lines.map((rawLine, idx) => {
        const trimmed = rawLine.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        const bulletMatch = trimmed.match(/^([•\-*]|\d+\.)\s+(.*)$/);
        if (bulletMatch) {
          const marker = bulletMatch[1] === "-" || bulletMatch[1] === "*" ? "•" : bulletMatch[1];
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-semibold opacity-75 shrink-0">{marker}</span>
              <span className="flex-1">{renderInlineFormatting(bulletMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInlineFormatting(rawLine)}</p>;
      })}
    </div>
  );
};
