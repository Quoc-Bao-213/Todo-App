import z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const todoFormSchema = z.object({
  text: z.string().trim().min(1, "Todo text is required"),
  description: z.string().trim().optional(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;

interface TodoFormProps {
  defaultValues?: Partial<TodoFormValues>;
  onSubmit: (values: TodoFormValues) => void;
  disabled?: boolean;
  submitLabel?: string;
}

export const TodoForm = ({
  defaultValues,
  onSubmit,
  disabled,
  submitLabel = "Save",
}: TodoFormProps) => {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      text: "",
      description: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Text <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="What needs to be done?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add more details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="cursor-pointer" disabled={disabled}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
