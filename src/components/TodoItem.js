import React, { useState } from "react";

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
      console.log('tototo', typeof submitEditTodo)
      submitEditTodo(e.target.value, id);
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
      <div className="InnerTodoContainer">
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
          idx + 1 + '. ' + todoBody
        )}
      </div>
      <button 
        onClick={() => onDeleteTodo(id)}
        style={{ margin: 20, height: '50%', width: '8rem' }}
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem