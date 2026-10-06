import { useState, FormEvent } from 'react';
import { TodoFormProps } from '../types';
import { Button } from './Button';

export function TodoForm({ onAdd }: TodoFormProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
      />
      <Button type="submit" variant="primary" disabled={!value.trim()}>
        Add
      </Button>
    </form>
  );
}