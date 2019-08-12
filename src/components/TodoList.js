import React from "react";
import { CSSTransitionGroup } from "react-transition-group"; // ES6

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
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
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
      </CSSTransitionGroup>
    </div>
  );
};

export default TodoList;
