/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';

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
  EMPTY_TITLE_ERROR, // ✅ добавили
} from './constants/errordata';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  // ================= LOAD =================
  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(UNABLE_TO_LOAD_ERROR))
      .finally(() => setIsLoading(false));
  }, []);

  // ================= ADD =================
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      showError(EMPTY_TITLE_ERROR); // ✅ ИСПРАВЛЕНО
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

  // ================= DELETE =================
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

  // ================= TOGGLE ONE =================
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

  // ================= TOGGLE ALL =================
  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(t => t.completed !== newStatus);

    todosToUpdate.forEach(todo => handleToggleTodo(todo));
  };

  // ================= FILTERS =================
  const activeTodos = todos.filter(t => !t.completed).length;

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.completed);

    completed.forEach(todo => handleDeleteTodo(todo.id));
  };

  // ================= RENDER =================
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
          todos={todos}
          processingTodos={processingTodos}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          setTodos={setTodos}
          showError={showError}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            hasCompleted={todos.some(t => t.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* ✅ ИСПРАВЛЕНО */}
      <UserWarning
        error={error}
        onClose={() => setError(null)}
      />
    </div>
  );
};