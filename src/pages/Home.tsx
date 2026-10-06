import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from '../components/Header';
import { TodoForm } from '../components/TodoForm';
import { TodoCard } from '../components/TodoCard';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

export function Home() {
  const { activeTodos, completedTodos, addTodo, toggleTodo, deleteTodo, clearCompleted } =
    useLocalStorage();

  const allTodos = [...activeTodos, ...completedTodos];

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <Header
        title="My Todos"
        subtitle={`${activeTodos.length} task${activeTodos.length !== 1 ? 's' : ''} remaining`}
      />

      <TodoForm onAdd={addTodo} />

      {allTodos.length === 0 ? (
        <EmptyState message="No tasks yet. Add one above!" icon="✨" />
      ) : (
        <div className="space-y-2">
          {allTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </div>
      )}

      {completedTodos.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={clearCompleted}>
            Clear {completedTodos.length} completed
          </Button>
        </div>
      )}
    </div>
  );
}