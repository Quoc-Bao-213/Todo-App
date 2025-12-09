import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { TodoGetManyOutput } from "../../types";
import { EditTodoModal } from "./edit-todo-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoDetailModal } from "./todo-detail-modal";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoItemProps {
  todo: TodoGetManyOutput["items"][number];
}

export const TodoItemSkeleton = () => {
  return (
    <Card className="border-l-4 border-l-transparent">
      <CardContent className="p-4 flex items-start gap-3">
        <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>

        <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
      </CardContent>
    </Card>
  );
};

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const utils = trpc.useUtils();

  const updateTodo = trpc.todos.update.useMutation({
    onSuccess: () => {
      toast.success("Todo updated successfully");
      utils.todos.getMany.invalidate();
    },
    onError: () => {
      toast.error("Failed to update todo");
    },
  });

  const deleteTodo = trpc.todos.delete.useMutation({
    onSuccess: () => {
      toast.success("Todo deleted successfully");
      utils.todos.getMany.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete todo");
    },
  });

  const handleToggleComplete = () => {
    updateTodo.mutate({
      id: todo.id,
      text: todo.text,
      description: todo.description || undefined,
      completed: !todo.completed,
    });
  };

  const handleDelete = () => {
    deleteTodo.mutate({ id: todo.id });
  };

  return (
    <>
      <EditTodoModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        todoId={todo.id}
        todo={todo}
      />

      <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
        <CardContent className="p-4 flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            className="mt-1 cursor-pointer"
            disabled={updateTodo.isPending}
          />

          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "font-medium text-base truncate cursor-pointer",
                todo.completed && "text-muted-foreground line-through"
              )}
              onClick={() => setIsDetailOpen(true)}
            >
              {todo.text}
            </div>

            {todo.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {todo.description}
              </p>
            )}

            <div className="text-xs text-muted-foreground mt-2">
              {format(todo.createdAt, "PP p")}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                <InfoIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={deleteTodo.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <TodoDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        todo={todo}
        onToggleComplete={handleToggleComplete}
        onEdit={() => setIsEditOpen(true)}
        isUpdating={updateTodo.isPending}
      />
    </>
  );
};
