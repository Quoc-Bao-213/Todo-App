// interface TodoListProps {
//   todos: Todo[];
//   isLoading: boolean;
//   hasMore: boolean;
//   loadMore: () => void;
//   onToggle: (id: string) => void;
//   onDelete: (id: string) => void;
//   onUpdate: (id: string, updates: Partial<Todo>) => void;
// }

export const TodoListSection = () => {
  return (
    <div>TodoListSection</div>
    // <div className="space-y-4 pb-10">
    //   {todos.map((todo) => (
    //     <TodoItem
    //       key={todo.id}
    //       todo={todo}
    //       onToggle={onToggle}
    //       onDelete={onDelete}
    //       onUpdate={onUpdate}
    //     />
    //   ))}

    //   <div
    //     ref={observerTarget}
    //     className="h-10 flex justify-center items-center"
    //   >
    //     {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
    //     {!hasMore && todos.length > 0 && (
    //       <p className="text-xs text-muted-foreground">No more todos to load</p>
    //     )}
    //   </div>
    // </div>
  );
};
