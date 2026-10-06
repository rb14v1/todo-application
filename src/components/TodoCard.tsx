import { TodoCardProps } from '../types';

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          todo.completed
            ? 'bg-v1-teal border-v1-teal text-white'
            : 'border-gray-300 hover:border-v1-teal'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm md:text-base font-medium transition-colors duration-200 ${
          todo.completed ? 'line-through text-gray-400' : 'text-v1-dark'
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}