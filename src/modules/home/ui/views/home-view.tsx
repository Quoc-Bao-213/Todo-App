import { TodosSection } from "../sections/todos-section";

export const HomeView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <TodosSection />
    </div>
  );
};
