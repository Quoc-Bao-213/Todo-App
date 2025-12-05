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
  //   getOne: baseProcedure
  //     .input(z.object({ id: z.uuid() }))
  //     .query(async ({ input, ctx }) => {
  //       const { clerkUserId } = ctx;

  //       let userId;

  //       const [user] = await db
  //         .select()
  //         .from(users)
  //         .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

  //       if (user) {
  //         userId = user.id;
  //       }

  //       const viewerReactions = db.$with("viewer_reactions").as(
  //         db
  //           .select({
  //             videoId: videoReactions.videoId,
  //             type: videoReactions.type,
  //           })
  //           .from(videoReactions)
  //           .where(inArray(videoReactions.userId, userId ? [userId] : []))
  //       );

  //       const viewerSubscriptions = db.$with("viewer_subscriptions").as(
  //         db
  //           .select()
  //           .from(subscriptions)
  //           .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
  //       );

  //       const [existingVideo] = await db
  //         .with(viewerReactions, viewerSubscriptions)
  //         .select({
  //           ...getTableColumns(videos),
  //           user: {
  //             ...getTableColumns(users),
  //             subscriberCount: db.$count(
  //               subscriptions,
  //               eq(subscriptions.creatorId, users.id)
  //             ),
  //             viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
  //               Boolean
  //             ),
  //           },
  //           viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
  //           likeCount: db.$count(
  //             videoReactions,
  //             and(
  //               eq(videoReactions.videoId, videos.id),
  //               eq(videoReactions.type, "like")
  //             )
  //           ),
  //           dislikeCount: db.$count(
  //             videoReactions,
  //             and(
  //               eq(videoReactions.videoId, videos.id),
  //               eq(videoReactions.type, "dislike")
  //             )
  //           ),
  //           viewerReaction: viewerReactions.type,
  //         })
  //         .from(videos)
  //         .innerJoin(users, eq(videos.userId, users.id))
  //         .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
  //         .leftJoin(
  //           viewerSubscriptions,
  //           eq(viewerSubscriptions.creatorId, users.id)
  //         )
  //         .where(eq(videos.id, input.id));

  //       if (!existingVideo) {
  //         throw new TRPCError({ code: "NOT_FOUND" });
  //       }

  //       return existingVideo;
  //     }),
  //   remove: protectedProcedure
  //     .input(z.object({ id: z.uuid() }))
  //     .mutation(async ({ ctx, input }) => {
  //       const { id: userId } = ctx.user;

  //       const [removedVideo] = await db
  //         .delete(videos)
  //         .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
  //         .returning();

  //       if (!removedVideo) {
  //         throw new TRPCError({ code: "NOT_FOUND" });
  //       }

  //       return removedVideo;
  //     }),
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
