import { readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { rewriteSourceUrl } from './source-files.mjs';

export default function remarkSourceLinks({ generatedDir }) {
  const revisions = JSON.parse(readFileSync(join(generatedDir, 'revisions.json'), 'utf8'));

  return (tree, file) => {
    const [repository, ...parts] = relative(generatedDir, file.path).split(sep);
    const revision = revisions[repository];
    if (!revision) {
      return;
    }

    const sourceFile = parts.join('/');
    const visit = (node) => {
      if (['definition', 'image', 'link'].includes(node.type)) {
        node.url = rewriteSourceUrl(node.url, sourceFile, repository, revision);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
