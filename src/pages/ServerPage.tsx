import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { ErrorBoundary } from 'react-error-boundary';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
}

const ServerPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Data Fetching Example</h1>
      <p className="mb-4">
        This page demonstrates how to use Supabase with React.
      </p>
      
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Todo List</h2>
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <h3 className="text-red-700 font-semibold mb-2">Error loading todos</h3>
              <p className="text-sm text-red-600 mb-3">{error.message}</p>
              <button 
                onClick={resetErrorBoundary}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}
        >
          <TodoList />
        </ErrorBoundary>
      </div>
    </div>
  );
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data, error } = await supabase.from('todos').select('*');
        
        if (error) throw error;
        setTodos(data || []);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load todos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading todos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-gray-500 italic">No todos found. Create some in the /todos page first.</div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {todos.map((todo) => (
        <li key={todo.id} className="py-3 flex items-center">
          <span className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </span>
          <span className="ml-auto text-xs text-gray-500">
            {todo.created_at ? new Date(todo.created_at).toLocaleDateString() : ''}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ServerPage;
