import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// content/resume.md is talent-agent's approved export. Without it there is no resume page and no link.
export function readResume(): string | null {
  const file = path.join(process.cwd(), 'content', 'resume.md');
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8').trim() || null;
}
