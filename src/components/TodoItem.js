import React, { useState } from "react";

import { FaCircle, FaList, FaCheckCircle } from 'react-icons/fa';

const TodoItem = ({
  id,
  idx,
  onDeleteTodo,
  onToggleTodo,
  submitEditTodo,
  todo: { body, status }
}) => {
  const [isEditing, setIsEditing] = useState("");
  const [todoBody, setTodoBody] = useState(body);

  let timer = 0;
  let delay = 200;
  let prevent = false;

  const doDoubleClickAction = () => {
    setIsEditing(true);
  };

  const handleClick = () => {
    timer = setTimeout(() => {
      if (!prevent) {
        onToggleTodo(id);
      }
      prevent = false;
    }, delay);
  };

  const handleDoubleClick = () => {
    clearTimeout(timer);
    prevent = true;
    doDoubleClickAction();
  };

  const keyPress = e => {
    if (e.keyCode === 13) {
      setIsEditing(false);
      submitEditTodo(e.target.value, id);
    }
  };

  const onChange = e => {
    setTodoBody(e.target.value);
  };

  const isDone = status === "Done";

  return (
    <div
      className={`TodoItem TodoItem${isDone ? "Done" : "Active"}`}
    >
      <div style={{ marginLeft: 10, marginRight: 10, width: 50 }}>
        {idx + 1 + '. '}
      </div>
      {isDone ? <FaCheckCircle color="lightblue" /> : <FaCircle color="lightgrey" />}
      <div className="InnerTodoContainer"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing 
          ? (<input
              autoFocus
              value={todoBody}
              onChange={onChange}
              onKeyDown={keyPress}
              className="EditTodo"
              placeholder="Enter todo name here"
              onBlur={() => setIsEditing(!isEditing)}
            />
          ) 
          : todoBody}
      </div>
      <div 
        className="Btn-Delete"
        onClick={() => onDeleteTodo(id)}
      >
        X
      </div>
    </div>
  );
};

export default TodoItem