import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from '../components/Header';
import { TodoCard } from '../components/TodoCard';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

export function Completed() {
  const { completedTodos, toggleTodo, deleteTodo, clearCompleted } = useLocalStorage();

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <Header
        title="Completed Tasks"
        subtitle={`${completedTodos.length} task${completedTodos.length !== 1 ? 's' : ''} completed`}
      />

      {completedTodos.length === 0 ? (
        <EmptyState
          message="No completed tasks yet. Get to work!"
          icon="🎯"
        />
      ) : (
        <>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="danger" onClick={clearCompleted}>
              Clear All Completed
            </Button>
          </div>
        </>
      )}
    </div>
  );
}