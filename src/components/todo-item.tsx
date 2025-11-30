"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Pencil, MoreVertical } from "lucide-react";
import { Todo } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TodoForm } from "./todo-form";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleUpdate = (values: { text: string; description?: string }) => {
    onUpdate(todo.id, values);
    setIsEditing(false);
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
        <CardContent className="p-4 flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1"
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
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <TodoForm
            defaultValues={{
              text: todo.text,
              description: todo.description,
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todo Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{todo.text}</h3>
              <div className="text-sm text-muted-foreground">
                Created on {format(todo.createdAt, "PPP p")}
              </div>
            </div>
            {todo.description ? (
              <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                {todo.description}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No description provided.
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant={todo.completed ? "outline" : "default"}
                onClick={() => {
                  onToggle(todo.id);
                  setIsDetailOpen(false);
                }}
              >
                {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
