import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="(?!https?:|tel:|#)([^"?#]+)["?#]/g)].map((match) => match[1]);
await Promise.all(refs.map((ref) => access(resolve(root, ref))));
for (const required of ['preRegisterForm', '/api/pre-registration', 'montessoriplayhousegfd@gmail.com']) {
  const sources = `${html}\n${await readFile(resolve(root, 'script.js'), 'utf8')}\n${await readFile(resolve(root, 'api/pre-registration.js'), 'utf8')}`;
  if (!sources.includes(required)) throw new Error(`Missing required integration: ${required}`);
}
console.log(`Validated HTML, JavaScript, API integration and ${refs.length} local assets.`);
