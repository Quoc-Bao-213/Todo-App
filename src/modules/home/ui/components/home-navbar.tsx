"use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
// import { Plus } from "lucide-react";
// import { useState } from "react";

export const HomeNavbar = () => {
  // const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">My Tasks</h1>

        {/* New Task Button */}
        {/* <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full px-4">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TodoForm onSubmit={handleCreate} submitLabel="Create Task" />
          </DialogContent>
        </Dialog> */}

        {/* Auth Button */}
        <AuthButton />
      </div>
    </header>
  );
};
