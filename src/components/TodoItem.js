import React, { useState } from "react";

const TodoItem = ({
  idx,
  onEditTodo,
  onToggleTodo,
  submitNewTodoItem,
  todo: { body, status }
}) => {
  const [isEditing, setIsEditing] = useState("");
  const [todoBody, setTodoBody] = useState(body);

  let timer = 0;
  let delay = 200;
  let prevent = false;

  const doDoubleClickAction = () => {
    onEditTodo(idx);
    setIsEditing(true);
  };

  const handleClick = () => {
    timer = setTimeout(() => {
      if (!prevent) {
        onToggleTodo(idx);
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
      submitNewTodoItem(e.target.value, idx);
    }
  };

  const onChange = e => {
    setTodoBody(e.target.value);
  };

  const isDone = status === "done";

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`TodoItem TodoItem${isDone ? "Done" : "Active"}`}
    >
      <input
        type="checkbox"
        checked={isDone}
        className="Checkbox"
        onClick={handleClick}
        onChange={handleClick}
      />
      {isEditing ? (
        <input
          autoFocus
          value={todoBody}
          onChange={onChange}
          onKeyDown={keyPress}
          className="EditTodo"
          placeholder="Enter todo name here"
          onBlur={() => setIsEditing(!isEditing)}
        />
      ) : (
        todoBody
      )}
    </div>
  );
};

export default TodoItem