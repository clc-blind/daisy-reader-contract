// eslint-disable-next-line import/no-extraneous-dependencies
import { generateOpenApi } from '@ts-rest/open-api';
import { appContract } from '@/src/contract';

export const openApiDocument = generateOpenApi(appContract, {
  info: {
    title: 'DAISY API',
    version: '1.0.0',
  },
});
