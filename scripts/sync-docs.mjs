import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { organization, projects } from '../projects.mjs';
import { isPublishedFile } from './source-files.mjs';

const siteRoot = fileURLToPath(new URL('../', import.meta.url));
const localSources = process.env.HBS_DOCS_SOURCE_DIR;
const stage = resolveInside(siteRoot, mkdtempSync(join(siteRoot, '.docs-sync-')));
const prepared = join(stage, 'content');
const destination = resolveInside(siteRoot, '.generated-docs');
const revisions = {};

try {
  for (const { name } of projects) {
    const checkout = localSources ? resolve(localSources, name) : join(stage, name);
    if (!localSources) {
      git(['clone', '--quiet', '--depth', '1', '--single-branch', '--branch', 'master',
        `https://github.com/${organization}/${name}.git`, checkout], siteRoot);
    }

    const revision = git(['rev-parse', 'refs/heads/master'], checkout).toString().trim();
    const files = git(['ls-tree', '-r', '-z', revision], checkout)
      .toString()
      .split('\0')
      .filter((entry) => /^100(644|755) blob /.test(entry))
      .map((entry) => entry.slice(entry.indexOf('\t') + 1))
      .filter(isPublishedFile);

    if (!files.includes('README.md')) {
      throw new Error(`В master репозитория ${name} отсутствует README.md`);
    }

    const projectDir = join(prepared, name);
    for (const file of files) {
      const output = resolveInside(projectDir, file);
      mkdirSync(dirname(output), { recursive: true });
      writeFileSync(output, git(['show', `${revision}:${file}`], checkout));
    }

    revisions[name] = revision;
    const markdownCount = files.filter((file) => file.endsWith('.md')).length;
    console.log(`${name} ${revision.slice(0, 7)}: страниц ${markdownCount}`);
  }

  writeFileSync(join(prepared, 'revisions.json'), JSON.stringify(revisions, null, 2));
  rmSync(destination, { recursive: true, force: true });
  renameSync(prepared, destination);
} finally {
  rmSync(stage, { recursive: true, force: true });
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, maxBuffer: 32 * 1024 * 1024 });
}

function resolveInside(parent, child) {
  const absolute = resolve(parent, child);
  const withinParent = relative(parent, absolute);
  if (!withinParent || withinParent === '..' || withinParent.startsWith(`..${sep}`) || isAbsolute(withinParent)) {
    throw new Error(`Путь ${absolute} находится вне ${parent}`);
  }
  return absolute;
}
