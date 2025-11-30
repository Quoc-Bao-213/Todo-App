"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTodos } from "@/hooks/use-todos";
import { TodoList } from "@/components/todo-list";
import { TodoForm } from "@/components/todo-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  const {
    todos,
    isLoading,
    hasMore,
    loadMore,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = (values: { text: string; description?: string }) => {
    addTodo(values.text, values.description);
    setIsCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">My Tasks</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full px-4">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TodoForm onSubmit={handleCreate} submitLabel="Create Task" />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <TodoList
          todos={todos}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </main>
    </div>
  );
}
