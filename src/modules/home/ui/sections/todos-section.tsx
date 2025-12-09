"use client";

import { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ErrorBoundary } from "react-error-boundary";
import {
  TodoItem,
  TodoItemSkeleton,
} from "@/modules/todos/ui/components/todo-item";

export const TodosSection = () => {
  return (
    <Suspense fallback={<TodosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <TodosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const TodosSectionSkeleton = () => {
  return (
    <div className="space-y-4 pb-10">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <TodoItemSkeleton key={index} />
      ))}
    </div>
  );
};

const TodosSectionSuspense = () => {
  const [todos, query] = trpc.todos.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <div className="space-y-4 pb-10">
        {todos.pages
          .flatMap((page) => page.items)
          .map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </>
  );
};
