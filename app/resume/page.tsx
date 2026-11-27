import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import EmailLink from '@/components/EmailLink';
import { readResume } from '@/lib/resume';

export const metadata: Metadata = {
  title: 'Resume: Dale Wiggins',
  robots: { index: false, follow: false },
};

// **bold** and _emphasis_; underscores inside words (file_names) stay as they are.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*.+?\*\*|(?<!\w)_.+?_(?!\w))/g).map((part, i) => {
    if (/^\*\*.+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^_.+_$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

// The subset talent-agent's export writes: headings, "- " lists and paragraphs.
function render(markdown: string): ReactNode[] {
  const out: ReactNode[] = [];
  let items: ReactNode[] = [];
  const flush = () => {
    if (items.length) out.push(<ul key={`ul${out.length}`}>{items}</ul>);
    items = [];
  };
  markdown.split(/\r?\n/).forEach((line, i) => {
    if (line.startsWith('- ')) {
      items.push(<li key={i}>{inline(line.slice(2))}</li>);
      return;
    }
    flush();
    const heading = line.match(/^(#{1,3}) (.*)$/);
    if (heading) {
      // The page header holds the only h1, so the file's title becomes an h2.
      const Tag = heading[1].length === 3 ? 'h3' : 'h2';
      out.push(<Tag key={i}>{inline(heading[2])}</Tag>);
    } else if (line.trim()) {
      out.push(<p key={i}>{inline(line)}</p>);
    }
  });
  flush();
  return out;
}

export default function ResumePage() {
  const markdown = readResume();
  if (!markdown) notFound();
  return (
    <>
      <header>
        <h1><Link href="/">Dale Wiggins</Link></h1>
        <p><EmailLink /></p>
      </header>
      <main className="resume">{render(markdown)}</main>
    </>
  );
}
