import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../constants/userdata';
import { EMPTY_TITLE_ERROR } from '../../constants/errordata';

type Props = {
  newTitle: string;
  setNewTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  allCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  onToggleAll,
  allCompleted,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔥 ВАЖНО: фокус после КАЖДОГО рендера
  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          autoFocus
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setNewTitle(e.target.value)}
        />
      </form>
    </header>
  );
};