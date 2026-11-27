import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// content/profile.md is the owner's own resume; content/resume.md is talent-agent's approved export, shown where
// profile.md says <!-- projects -->. With neither there is no resume page and no link.
function readContent(name: string): string {
  const file = path.join(process.cwd(), 'content', name);
  if (!existsSync(file)) return '';
  const text = readFileSync(file, 'utf8').trim();
  // The working view (`talent resume`) marks drafts and names private repos: fail the build rather than publish it.
  if (/\(draft #\d+\)|_\(#\d+\)_|unnamed in exports|talent resume approve/.test(text)) {
    throw new Error(`content/${name} is the drafts view; use \`talent resume export\` (approved items only)`);
  }
  return text;
}

// The export's projects only: its file title goes, and so does the closing "## Skills" list (profile.md has skills).
function recentProjects(exported: string): string {
  return exported
    .replace(/^# .*$/m, '')
    .replace(/^## Skills$[\s\S]*/m, '')
    .replace(/^## Projects$/m, '## Recent projects')
    .trim();
}

export function readResume(): string | null {
  const profile = readContent('profile.md');
  const exported = readContent('resume.md');
  if (!profile) return exported || null;
  // A function replacement, so "$" in the export stays as written.
  return profile.replace('<!-- projects -->', () => recentProjects(exported));
}
