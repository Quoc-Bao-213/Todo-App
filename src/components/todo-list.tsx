"use client";

import { useEffect, useRef } from "react";
import { Todo } from "@/hooks/use-todos";
import { TodoItem } from "./todo-item";
import { Loader2 } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export function TodoList({
  todos,
  isLoading,
  hasMore,
  loadMore,
  onToggle,
  onDelete,
  onUpdate,
}: TodoListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  if (todos.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No todos yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      <div
        ref={observerTarget}
        className="h-10 flex justify-center items-center"
      >
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        {!hasMore && todos.length > 0 && (
          <p className="text-xs text-muted-foreground">No more todos to load</p>
        )}
      </div>
    </div>
  );
}
