import z from "zod";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const todosRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit } = input;

      const data = await db
        .select()
        .from(todos)
        .where(
          and(
            eq(todos.userId, userId),
            cursor
              ? or(
                  lt(todos.updatedAt, cursor.updatedAt),
                  and(
                    eq(todos.updatedAt, cursor.updatedAt),
                    lt(todos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(todos.updatedAt), desc(todos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return { items, nextCursor };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        text: z.string().trim().min(1, "Todo text is required"),
        description: z.string().trim().optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id, text, description, completed } = input;

      const [updatedTodo] = await db
        .update(todos)
        .set({
          text,
          description,
          completed,
          updatedAt: new Date(),
        })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .returning();

      if (!updatedTodo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updatedTodo;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [deletedTodo] = await db
        .delete(todos)
        .where(and(eq(todos.id, input.id), eq(todos.userId, userId)))
        .returning();

      if (!deletedTodo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedTodo;
    }),
  create: protectedProcedure
    .input(z.object({ text: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { text, description } = input;

      const [createdTodo] = await db
        .insert(todos)
        .values({
          userId,
          text,
          description,
        })
        .returning();

      return createdTodo;
    }),
});
