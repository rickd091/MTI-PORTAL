import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching todos:', error);
        setError(error.message);
      } else {
        setTodos(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    
    try {
      const newTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('todos').insert([newTodo]);
      
      if (error) {
        console.error('Error adding todo:', error);
        setError(error.message);
      } else {
        setNewTodoTitle('');
        fetchTodos(); // Refresh the list
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !currentStatus })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating todo:', error);
        setError(error.message);
      } else {
        // Update local state
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !currentStatus } : todo
        ));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting todo:', error);
        setError(error.message);
      } else {
        // Update local state
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Todo List with Supabase</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Add new todo form */}
      <div className="mb-6 flex">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading todos...</span>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && todos.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p>No todos found. Add your first todo using the form above.</p>
          <p className="mt-2 text-sm">Note: You may need to create the 'todos' table in your Supabase database with the following columns:</p>
          <ul className="list-disc ml-6 mt-1 text-sm">
            <li>id (uuid, primary key)</li>
            <li>title (text)</li>
            <li>completed (boolean)</li>
            <li>created_at (timestamp with time zone)</li>
          </ul>
        </div>
      )}
      
      {/* Todo list */}
      {todos.length > 0 && (
        <ul className="bg-white rounded-lg shadow divide-y">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center p-4 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
              />
              <span 
                className={`ml-3 flex-grow ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
