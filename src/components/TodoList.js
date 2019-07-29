import React from "react";

import TodoItem from "./TodoItem";
import TodoPrompt from "./TodoPrompt";

const TodoList = ({
  todos,
  loading,
  currentUser,
  onToggleTodo,
  onDeleteTodo,
  submitEditTodo
}) => {
  return (
    <div className="TodoContainer">
      {loading && <div className="loader" />}
      <TodoPrompt todoList={todos} currentUser={currentUser} />
      {todos.map((todo, idx) => {
        return (
          <TodoItem
            idx={idx}
            todo={todo}
            id={todo.id}
            key={todo.id}
            onToggleTodo={onToggleTodo}
            submitEditTodo={submitEditTodo}
            onDeleteTodo={id => onDeleteTodo(id)}
          />
        );
      })}
    </div>
  );
};

export default TodoList;
