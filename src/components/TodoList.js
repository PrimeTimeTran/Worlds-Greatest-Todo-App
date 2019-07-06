import React from "react";

import TodoItem from './TodoItem';

const TodoList = (props) => {
  return (
    props.todoList.map((todo, idx) => {
      return (
        <TodoItem
          idx={idx}
          todo={todo}
          id={todo.id}
          key={todo.id}
          onKeyDown={props.keyPress}
          submitEditTodo={props.submitEditTodo}
          onToggleTodo={props.onToggleTodo}
          onDeleteTodo={props.onDeleteTodo}
        />
      );
    })
  )
}

export default TodoList