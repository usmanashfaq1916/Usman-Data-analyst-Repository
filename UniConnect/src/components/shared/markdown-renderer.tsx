interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-gray-700">$1</li>')
    .replace(/(<li.*<\/li>)\n(?!<li)/g, '$1</ul>')
    .replace(/(?:^|\n)(?!<[^>]+>)(.+?)(?:\n|$)/g, (m, p1) => {
      if (p1.trim().startsWith("<h") || p1.trim().startsWith("<li") || p1.trim().startsWith("<ul") || p1.trim() === "") return m;
      if (p1.trim().startsWith("<code")) return m;
      return `<p class="mb-4 text-gray-700 leading-relaxed">${p1.trim()}</p>\n`;
    });

  return (
    <div
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
