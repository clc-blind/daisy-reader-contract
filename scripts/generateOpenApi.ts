import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { openApiDocument } from '@/src/libs/openApi';

const main = async () => {
  // eslint-disable-next-line no-underscore-dangle
  const __filename = fileURLToPath(import.meta.url);
  // eslint-disable-next-line no-underscore-dangle
  const __dirname = path.dirname(__filename);

  writeFile(
    path.join(__dirname, '..', './openapi/openapi.json'),
    JSON.stringify(openApiDocument, null, 2),
    'utf-8',
  );
};

main();
