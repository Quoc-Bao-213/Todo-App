import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TodoGetManyOutput } from "../../types";
import { ResponsiveModal } from "@/components/responsive-modal";

interface TodoDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoGetManyOutput["items"][number];
  onToggleComplete: () => void;
  onEdit: () => void;
  isUpdating?: boolean;
}

export const TodoDetailModal = ({
  open,
  onOpenChange,
  todo,
  onToggleComplete,
  onEdit,
  isUpdating = false,
}: TodoDetailModalProps) => {
  return (
    <ResponsiveModal
      title="Todo details"
      open={open}
      onOpenChange={onOpenChange}
    >
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
              onToggleComplete();
              onOpenChange(false);
            }}
            disabled={isUpdating}
          >
            {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onEdit();
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
};
