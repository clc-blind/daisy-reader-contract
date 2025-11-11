// eslint-disable-next-line import/no-extraneous-dependencies
import { generateOpenApi } from '@ts-rest/open-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { betterAuth } from 'better-auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { openAPI } from 'better-auth/plugins';
import { appContract } from '@/src/contract';

const generateOpenApiDocument = async () => {
  const baseOpenApiDocument = generateOpenApi(appContract, {
    info: {
      title: 'DAISY API',
      version: '1.0.0',
    },
  });

  const betterAuthOpenApiDocument = await betterAuth({
    emailAndPassword: {
      enabled: true,
    },
    plugins: [openAPI()],
  }).api.generateOpenAPISchema();

  return {
    ...baseOpenApiDocument,
    paths: {
      ...baseOpenApiDocument.paths,
      ...betterAuthOpenApiDocument.paths,
    },
  };
};

export const openApiDocument = await generateOpenApiDocument();
