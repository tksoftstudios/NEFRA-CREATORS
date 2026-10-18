import React from 'react';

/**
 * Format inline markdown tokens: **bold**, *italic*, `code`
 */
function parseInline(text) {
  if (!text) return text;

  // Split by bold (**...**)
  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-zinc-300">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-zinc-800 text-rose-400 font-mono text-[11px]">
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = null;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h4 key={idx} className="text-sm font-bold text-white mt-3 mb-1 tracking-wide">
          {parseInline(trimmed.replace('### ', ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h3 key={idx} className="text-base font-bold text-white mt-4 mb-1.5 tracking-wide">
          {parseInline(trimmed.replace('## ', ''))}
        </h3>
      );
      return;
    }

    // Bullet points (-, *, •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) elements.push(currentList);
        currentList = {
          type: 'ul',
          key: `ul_${idx}`,
          items: []
        };
      }
      currentList.items.push(
        <li key={idx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
          <span>{parseInline(itemText)}</span>
        </li>
      );
      return;
    }

    // Numbered list (1., 2., etc.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      const [, num, itemText] = numMatch;
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) elements.push(currentList);
        currentList = {
          type: 'ol',
          key: `ol_${idx}`,
          items: []
        };
      }
      currentList.items.push(
        <li key={idx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5 my-1.5">
          <span className="font-semibold text-zinc-400 text-xs shrink-0 w-4">{num}.</span>
          <span>{parseInline(itemText)}</span>
        </li>
      );
      return;
    }

    // Regular paragraph
    if (currentList) {
      elements.push(currentList);
      currentList = null;
    }

    elements.push(
      <p key={idx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed my-1.5">
        {parseInline(trimmed)}
      </p>
    );
  });

  if (currentList) {
    elements.push(currentList);
  }

  return (
    <div className={`space-y-1 text-left ${className}`}>
      {elements.map((el, i) => {
        if (el?.type === 'ul') {
          return <ul key={el.key || i} className="my-2 space-y-1 pl-1">{el.items}</ul>;
        }
        if (el?.type === 'ol') {
          return <ol key={el.key || i} className="my-2 space-y-1 pl-1">{el.items}</ol>;
        }
        return el;
      })}
    </div>
  );
}
