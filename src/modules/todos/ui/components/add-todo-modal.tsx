import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { TodoForm, TodoFormValues } from "./todo-form";
import { ResponsiveModal } from "@/components/responsive-modal";

interface AddTodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTodoModal = ({ open, onOpenChange }: AddTodoModalProps) => {
  const utils = trpc.useUtils();

  const create = trpc.todos.create.useMutation({
    onSuccess: () => {
      toast.success("Todo created successfully");
      utils.todos.getMany.invalidate();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (values: TodoFormValues) => {
    create.mutate(values);
  };

  return (
    <ResponsiveModal
      title="Create new todo"
      open={open}
      onOpenChange={onOpenChange}
    >
      <TodoForm
        onSubmit={onSubmit}
        disabled={create.isPending}
        submitLabel="Create"
      />
    </ResponsiveModal>
  );
};
