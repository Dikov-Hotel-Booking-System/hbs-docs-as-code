import assert from 'node:assert/strict';
import test from 'node:test';
import { isPublishedFile, rewriteSourceUrl } from './source-files.mjs';

const repository = 'hbs-hotel-service';
const revision = 'af247c40d5d83baf064da233ed334cf24824ea32';
const github = `https://github.com/Dikov-Hotel-Booking-System/${repository}/blob/${revision}`;

test('publishes the README, Markdown in docs, and documentation images', () => {
  assert.equal(isPublishedFile('README.md'), true);
  assert.equal(isPublishedFile('docs/database/index.md'), true);
  assert.equal(isPublishedFile('docs/images/database.png'), true);
  assert.equal(isPublishedFile('.github/pull_request_template.md'), false);
  assert.equal(isPublishedFile('docs/openapi.yaml'), false);
});

test('keeps an imported Markdown link relative to the source document', () => {
  assert.equal(rewriteSourceUrl('/docs/database/index.md#таблицы', 'README.md', repository, revision),
    'docs/database/index.md#таблицы');
  assert.equal(rewriteSourceUrl('rooms_table.md', 'docs/database/index.md', repository, revision),
    'rooms_table.md');
});

test('links to the revision of the repository that supplied the document', () => {
  assert.equal(rewriteSourceUrl('docs/openapi.yaml', 'README.md', repository, revision),
    `${github}/docs/openapi.yaml`);
  assert.equal(rewriteSourceUrl('../.github/workflows/ci.yml#L1', 'docs/github_flow.md', repository, revision),
    `${github}/.github/workflows/ci.yml#L1`);
});

test('leaves external URLs and same-page anchors intact', () => {
  assert.equal(rewriteSourceUrl('https://example.org/', 'README.md', repository, revision), 'https://example.org/');
  assert.equal(rewriteSourceUrl('#запуск', 'README.md', repository, revision), '#запуск');
});

test('links to the raw image when it is outside the documentation directory', () => {
  assert.equal(rewriteSourceUrl('../assets/DB%20diagram.png', 'docs/database.md', repository, revision),
    `https://raw.githubusercontent.com/Dikov-Hotel-Booking-System/${repository}/${revision}/assets/DB%20diagram.png`);
});

test('rejects a link that escapes the source repository', () => {
  assert.throws(() => rewriteSourceUrl('../../outside.md', 'docs/index.md', repository, revision),
    /за пределы репозитория/);
});
