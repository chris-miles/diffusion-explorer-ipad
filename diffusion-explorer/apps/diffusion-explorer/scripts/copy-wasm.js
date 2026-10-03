import { mkdir, readdir, copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const source = path.dirname(require.resolve('@tensorflow/tfjs-backend-wasm'));
const destination = fileURLToPath(new URL('../static/tfjs-backend-wasm/', import.meta.url));
await mkdir(destination, { recursive: true });
for (const file of await readdir(source)) {
  if (file.endsWith('.wasm')) {
    await copyFile(path.join(source, file), path.join(destination, file));
  }
}
