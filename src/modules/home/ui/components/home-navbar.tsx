"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { AddTodoModal } from "@/modules/todos/ui/components/add-todo-modal";

export const HomeNavbar = () => {
  const [isOpenAddTodoModal, setIsOpenAddTodoModal] = useState(false);

  return (
    <>
      <AddTodoModal
        open={isOpenAddTodoModal}
        onOpenChange={setIsOpenAddTodoModal}
      />
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">My Todos</h1>

          <div className="shrink-0 items-center flex gap-4">
            <Button
              size="sm"
              className="rounded-full px-4 cursor-pointer"
              onClick={() => setIsOpenAddTodoModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Todo
            </Button>

            <AuthButton />
          </div>
        </div>
      </header>
    </>
  );
};
