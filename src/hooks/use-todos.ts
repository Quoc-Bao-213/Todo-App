import { useState, useEffect } from "react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  description?: string;
}

const STORAGE_KEY = "todo-app-data";
const ITEMS_PER_PAGE = 20;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Sort by createdAt desc
          parsed.sort((a: Todo, b: Todo) => b.createdAt - a.createdAt);
          setTodos(parsed);
        }
      } catch (e) {
        console.error("Failed to load todos", e);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate network delay for realistic feel
    setTimeout(loadData, 500);
  }, []);

  // Persist data whenever todos change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  const addTodo = (text: string, description?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      description,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Pagination logic for infinite scroll
  const paginatedTodos = todos.slice(0, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setHasMore(paginatedTodos.length < todos.length);
  }, [paginatedTodos.length, todos.length]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    todos: paginatedTodos,
    totalCount: todos.length,
    isLoading,
    hasMore,
    loadMore,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
}
