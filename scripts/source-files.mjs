import { posix } from 'node:path';
import { organization } from '../projects.mjs';

const imageExtension = /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i;

export function isPublishedFile(file) {
  return file === 'README.md' || (file.startsWith('docs/') && (/\.md$/i.test(file) || imageExtension.test(file)));
}

export function rewriteSourceUrl(url, sourceFile, repository, revision) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) {
    return url;
  }

  const [, pathname, suffix] = url.match(/^([^?#]*)(.*)$/);
  if (!pathname) {
    return url;
  }

  const decodedPath = decodeURIComponent(pathname);
  const repositoryPath = decodedPath.startsWith('/')
    ? posix.normalize(decodedPath).slice(1)
    : posix.normalize(posix.join(posix.dirname(sourceFile), decodedPath));

  if (repositoryPath === '..' || repositoryPath.startsWith('../')) {
    throw new Error(`Ссылка ${url} в ${repository}/${sourceFile} ведёт за пределы репозитория`);
  }

  if (isPublishedFile(repositoryPath)) {
    const relativePath = posix.relative(posix.dirname(sourceFile), repositoryPath);
    return encodePath(relativePath) + suffix;
  }

  const encodedPath = encodePath(repositoryPath);
  if (imageExtension.test(repositoryPath)) {
    return `https://raw.githubusercontent.com/${organization}/${repository}/${revision}/${encodedPath}${suffix}`;
  }

  return `https://github.com/${organization}/${repository}/blob/${revision}/${encodedPath}${suffix}`;
}

function encodePath(pathname) {
  return pathname.split('/').map(encodeURIComponent).join('/');
}
