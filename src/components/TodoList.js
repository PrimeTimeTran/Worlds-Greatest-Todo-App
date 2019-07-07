import React from "react";

import TodoItem from './TodoItem';

const TodoList = ({
  loading,
  todoList,
  keyPress,
  currentUser,
  onToggleTodo,
  onDeleteTodo,
  submitEditTodo,
}) => {
  const renderPrompt = () => {
    const isSignedIn =
      currentUser.email !== "" && currentUser.email !== undefined;
    if (isSignedIn && todoList.length === 0) {
      return <h1 className="Prompt">So much  todo, so little time...</h1>;
    } else if (currentUser.email !== "" && todoList.length === 0) {
      return <h1 className="Prompt">Signin to save your todos</h1>;
    }
  };

  return (
    <div className="TodoContainer">
      {loading && <div className="loader" />}
      {renderPrompt()}
      {todoList.map((todo, idx) => {
        return (
          <TodoItem
            idx={idx}
            todo={todo}
            id={todo.id}
            key={todo.id}
            onKeyDown={keyPress}
            onToggleTodo={onToggleTodo}
            submitEditTodo={submitEditTodo}
            onDeleteTodo={(id) => onDeleteTodo(id)}
          />
        );
      })}
    </div>
  )
}

export default TodoList