/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { UserWarning } from './components/UserWarning/UserWarning';

import { USER_ID } from './api/config';

import {
  UNABLE_TO_LOAD_ERROR,
  UNABLE_TO_ADD_ERROR,
  UNABLE_TO_DELETE_ERROR,
  UNABLE_TO_UPDATE_ERROR,
  EMPTY_TITLE_ERROR,
} from './constants/errordata';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All); // ✅ FIX
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  // LOAD
  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(UNABLE_TO_LOAD_ERROR))
      .finally(() => setIsLoading(false));
  }, []);

  // ADD
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      showError(EMPTY_TITLE_ERROR);
      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsLoading(true);

    createTodo(tempTodo)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTitle('');
      })
      .catch(() => showError(UNABLE_TO_ADD_ERROR))
      .finally(() => setIsLoading(false));
  };

  // DELETE
  const handleDeleteTodo = (id: number) => {
    setProcessingTodos(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => showError(UNABLE_TO_DELETE_ERROR))
      .finally(() => {
        setProcessingTodos(prev => prev.filter(tid => tid !== id));
      });
  };

  // TOGGLE
  const handleToggleTodo = (todo: Todo) => {
    setProcessingTodos(prev => [...prev, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updated => {
        setTodos(prev =>
          prev.map(t => (t.id === todo.id ? updated : t)),
        );
      })
      .catch(() => showError(UNABLE_TO_UPDATE_ERROR))
      .finally(() => {
        setProcessingTodos(prev => prev.filter(id => id !== todo.id));
      });
  };

  // TOGGLE ALL
  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const newStatus = !allCompleted;

    todos
      .filter(t => t.completed !== newStatus)
      .forEach(todo => handleToggleTodo(todo));
  };

  // CLEAR COMPLETED
  const handleClearCompleted = () => {
    todos
      .filter(t => t.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  // FILTERED TODOS ✅ FIX
  const filteredTodos = todos.filter(todo => {
    if (status === Status.All) return true;
    if (status === Status.Active) return !todo.completed;
    if (status === Status.Completed) return todo.completed;

    return true;
  });

  const activeTodos = todos.filter(t => !t.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onSubmit={handleAddTodo}
          onToggleAll={handleToggleAll}
          allCompleted={todos.length > 0 && todos.every(t => t.completed)}
        />

        <TodoList
          todos={filteredTodos} // ✅ FIX
          processingTodos={processingTodos}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          setTodos={setTodos}
          showError={showError}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            currentStatus={status}
            setStatus={setStatus}
            hasCompleted={todos.some(t => t.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <UserWarning
        error={error}
        onClose={() => setError(null)}
      />
    </div>
  );
};