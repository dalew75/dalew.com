import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// content/resume.md is talent-agent's approved export. Without it there is no resume page and no link.
export function readResume(): string | null {
  const file = path.join(process.cwd(), 'content', 'resume.md');
  if (!existsSync(file)) return null;
  const text = readFileSync(file, 'utf8').trim();
  // The working view (`talent resume`) marks drafts and names private repos: fail the build rather than publish it.
  if (/\(draft #\d+\)|_\(#\d+\)_|unnamed in exports|talent resume approve/.test(text)) {
    throw new Error('content/resume.md is the drafts view; use `talent resume export` (approved items only)');
  }
  return text || null;
}
