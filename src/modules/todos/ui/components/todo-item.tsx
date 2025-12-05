import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TodoGetManyOutput } from "../../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTodoModal } from "./edit-todo-modal";

interface TodoItemProps {
  todo: TodoGetManyOutput["items"][number];
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
            onCheckedChange={() => {}}
            className="mt-1 cursor-pointer"
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
                onClick={() => {}}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

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
                  //   onToggle(todo.id);
                  setIsDetailOpen(false);
                }}
              >
                {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditOpen(true);
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
};
