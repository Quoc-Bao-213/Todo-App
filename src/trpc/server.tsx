import "server-only";
import { cache } from "react";
import { appRouter } from "./routers/_app";
import { makeQueryClient } from "./query-client";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { createCallerFactory, createTRPCContext } from "./init";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
