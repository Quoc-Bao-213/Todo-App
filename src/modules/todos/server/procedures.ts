import z from "zod";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
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
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, userId),
            cursor
              ? or(
                  lt(tasks.updatedAt, cursor.updatedAt),
                  and(
                    eq(tasks.updatedAt, cursor.updatedAt),
                    lt(tasks.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(tasks.updatedAt), desc(tasks.id))
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
  //   update: protectedProcedure
  //     .input(videoUpdateSchema)
  //     .mutation(async ({ ctx, input }) => {
  //       const { id: userId } = ctx.user;

  //       if (!input.id) {
  //         throw new TRPCError({ code: "BAD_REQUEST" });
  //       }

  //       const [updatedVideo] = await db
  //         .update(videos)
  //         .set({
  //           title: input.title,
  //           description: input.description,
  //           categoryId: input.categoryId,
  //           visibility: input.visibility,
  //           updatedAt: new Date(),
  //         })
  //         .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
  //         .returning();

  //       if (!updatedVideo) {
  //         throw new TRPCError({ code: "NOT_FOUND" });
  //       }

  //       return updatedVideo;
  //     }),
  create: protectedProcedure
    .input(z.object({ text: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { text, description } = input;

      const [createdTask] = await db
        .insert(tasks)
        .values({
          userId,
          text,
          description,
        })
        .returning();

      return createdTask;
    }),
});
