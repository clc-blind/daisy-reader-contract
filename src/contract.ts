import type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from '@orpc/contract';
import { bookRoutes } from '@/src/contracts/book.contract';
import { fileRoutes } from '@/src/contracts/file.contract';
import { markRoutes } from '@/src/contracts/mark.contract';
import { readingRoutes } from '@/src/contracts/reading.contract';
import { systemRoutes } from '@/src/contracts/system.contract';
import { userRoutes } from '@/src/contracts/user.contract';

export const appContract = {
  ...bookRoutes,
  ...userRoutes,
  ...readingRoutes,
  ...markRoutes,
  ...fileRoutes,
  ...systemRoutes,
} as const;

export type AppContract = typeof appContract;
export type AppContractInputs = InferContractRouterInputs<AppContract>;
export type AppContractOutputs = InferContractRouterOutputs<AppContract>;
