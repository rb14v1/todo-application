import { useState, useEffect } from 'react';
import { Todo } from '../types';

const STORAGE_KEY = 'v1-todos';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const SEED_TODOS: Todo[] = [
  { id: generateId(), title: 'Buy groceries', completed: false },
  { id: generateId(), title: 'Read a book', completed: false },
  { id: generateId(), title: 'Exercise for 30 minutes', completed: true },
];

export function useLocalStorage() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Todo[];
      }
      return SEED_TODOS;
    } catch {
      return SEED_TODOS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string): void => {
    const newTodo: Todo = {
      id: generateId(),
      title: title.trim(),
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = (): void => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return {
    todos,
    activeTodos,
    completedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
}