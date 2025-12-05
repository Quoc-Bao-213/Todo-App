"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { TodoItem } from "@/modules/todos/ui/components/todo-item";

export const TodosSection = () => {
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
