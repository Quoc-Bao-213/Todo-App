"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { AddTaskModal } from "@/modules/tasks/ui/components/add-task-modal";

export const HomeNavbar = () => {
  const [isOpenAddTaskModal, setIsOpenAddTaskModal] = useState(false);

  return (
    <>
      <AddTaskModal
        open={isOpenAddTaskModal}
        onOpenChange={setIsOpenAddTaskModal}
      />
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">My Tasks</h1>

          <div className="shrink-0 items-center flex gap-4">
            <Button
              size="sm"
              className="rounded-full px-4 cursor-pointer"
              onClick={() => setIsOpenAddTaskModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>

            <AuthButton />
          </div>
        </div>
      </header>
    </>
  );
};
