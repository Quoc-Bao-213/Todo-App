import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { TodoGetManyOutput } from "../../types";
import { TodoForm, TodoFormValues } from "./todo-form";
import { ResponsiveModal } from "@/components/responsive-modal";

interface EditTodoModalProps {
  todoId: string;
  todo: TodoGetManyOutput["items"][number];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTodoModal = ({
  todoId,
  todo,
  open,
  onOpenChange,
}: EditTodoModalProps) => {
  const utils = trpc.useUtils();

  const update = trpc.todos.update.useMutation({
    onSuccess: () => {
      toast.success("Todo updated successfully");
      utils.todos.getMany.invalidate();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (values: TodoFormValues) => {
    update.mutate({
      id: todoId,
      ...values,
    });
  };

  return (
    <ResponsiveModal title="Edit todo" open={open} onOpenChange={onOpenChange}>
      <TodoForm
        onSubmit={onSubmit}
        disabled={update.isPending}
        submitLabel="Save Changes"
        defaultValues={{
          text: todo.text,
          description: todo.description || "",
        }}
      />
    </ResponsiveModal>
  );
};
