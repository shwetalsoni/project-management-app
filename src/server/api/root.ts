import { postRouter } from "@/server/api/routers/post";
import { signUpRouter } from "@/server/api/routers/signup";

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { taskRouter } from "./routers/task";
import { projectRouter } from "./routers/project";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  signUp: signUpRouter,
  tasks: taskRouter,
  projects: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
