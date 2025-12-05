import { createTRPCRouter } from "../init";
import { todosRouter } from "@/modules/todos/server/procedures";

export const appRouter = createTRPCRouter({
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;
