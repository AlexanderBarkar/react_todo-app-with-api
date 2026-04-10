import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null; // ✅ ДОБАВЛЕНО
  processingTodos: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingTodos,
  onDelete,
  onToggle,
  setTodos,
  showError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* обычные todos */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          onToggle={() => onToggle(todo)}
          processingTodos={processingTodos}
          setTodos={setTodos}
          showError={showError}
        />
      ))}

      {/* 🔥 TEMP TODO (самое важное) */}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          onToggle={() => {}}
          processingTodos={[0]} // чтобы показать loader
          setTodos={setTodos}
          showError={showError}
        />
      )}
    </section>
  );
};
