import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="(?!https?:|tel:|#)([^"?#]+)["?#]/g)].map((match) => match[1]);
await Promise.all(refs.map((ref) => access(resolve(root, ref))));
for (const required of ['preRegisterForm', '/api/pre-registration', 'montessoriplayhousegfd@gmail.com']) {
  const sources = `${html}\n${await readFile(resolve(root, 'script.js'), 'utf8')}\n${await readFile(resolve(root, 'api/pre-registration.js'), 'utf8')}`;
  if (!sources.includes(required)) throw new Error(`Missing required integration: ${required}`);
}
const output = resolve(root, 'public');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const spanishTitle = 'Montessori Playhouse | Daycare y After School';
const spanishDescription = 'Un ambiente seguro, amoroso y educativo donde los niños aprenden, juegan y crecen. Programas de daycare y after school para bebés, toddlers y niños en edad preescolar.';
const spanishHtml = html
  .replace('<html lang="en">', '<html lang="es">')
  .replace(/<title>[^<]+<\/title>/, `<title>${spanishTitle}</title>`)
  .replace(/<meta name="description" content="[^"]+" \/>/, `<meta name="description" content="${spanishDescription}" />`)
  .replace(/<meta property="og:title" content="[^"]+" \/>/, `<meta property="og:title" content="${spanishTitle}" />`)
  .replace(/<meta property="og:description" content="[^"]+" \/>/, `<meta property="og:description" content="${spanishDescription}" />`)
  .replace('<meta property="og:url" content="https://www.montessoriplayhousegfd.com/" />', '<meta property="og:url" content="https://www.montessoriplayhousegfd.com/es/" />')
  .replace('<meta property="og:locale" content="en_US" />', '<meta property="og:locale" content="es_US" />')
  .replace('<meta property="og:locale:alternate" content="es_US" />', '<meta property="og:locale:alternate" content="en_US" />')
  .replace(/<meta name="twitter:title" content="[^"]+" \/>/, `<meta name="twitter:title" content="${spanishTitle}" />`)
  .replace(/<meta name="twitter:description" content="[^"]+" \/>/, `<meta name="twitter:description" content="${spanishDescription}" />`)
  .replace('<link rel="canonical" href="https://www.montessoriplayhousegfd.com/" />', '<link rel="canonical" href="https://www.montessoriplayhousegfd.com/es/" />');
await mkdir(resolve(output, 'es'), { recursive: true });
await Promise.all([
  cp(resolve(root, 'index.html'), resolve(output, 'index.html')),
  writeFile(resolve(output, 'es/index.html'), spanishHtml),
  cp(resolve(root, 'styles.css'), resolve(output, 'styles.css')),
  cp(resolve(root, 'script.js'), resolve(output, 'script.js')),
  cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true }),
  cp(resolve(root, 'social'), resolve(output, 'social'), { recursive: true }),
]);

console.log(`Validated HTML, JavaScript, API integration and ${refs.length} local assets. Built static site in public/.`);
