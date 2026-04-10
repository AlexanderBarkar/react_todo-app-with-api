import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  processingTodos: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  processingTodos,
  onDelete,
  onToggle,
  setTodos,
  showError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
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
    </section>
  );
};
