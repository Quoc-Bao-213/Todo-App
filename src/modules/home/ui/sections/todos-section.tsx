"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { TodoItem } from "@/modules/todos/ui/components/todo-item";

export const TodosSection = () => {
  const [tasks, query] = trpc.todos.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <div className="space-y-4 pb-10">
        {tasks.pages
          .flatMap((page) => page.items)
          .map((task) => (
            <TodoItem key={task.id} todo={task} />
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
