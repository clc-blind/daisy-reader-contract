import { initContract } from '@ts-rest/core';
import { bookRoutes } from '@/src/contracts/book.contract';
import { fileRoutes } from '@/src/contracts/file.contract';
import { markRoutes } from '@/src/contracts/mark.contract';
import { readingRoutes } from '@/src/contracts/reading.contract';
import { userRoutes } from '@/src/contracts/user.contract';

const c = initContract();

export const appContract = c.router({
  // Books Domain
  ...bookRoutes,

  // Users Domain
  ...userRoutes,

  // Reading Progress Domain
  ...readingRoutes,

  // Marks Domain
  ...markRoutes,

  // Files Domain
  ...fileRoutes,
});
