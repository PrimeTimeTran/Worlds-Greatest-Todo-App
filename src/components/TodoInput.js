import React from "react";

const TodoInput = ({ keyPress, newTodoBody, currentUser, setNewTodoItem }) => {
  return (
    <div className="input-container">
      <h1 className="Prompt prompt-title">Todo List</h1>
      <input
        autoFocus
        value={newTodoBody}
        onKeyDown={keyPress}
        className="NewTodoInput"
        placeholder={`Enter todo here ${
          currentUser.email !== undefined ? currentUser.email : ""
        }`}
        onChange={e => {
          setNewTodoItem(e.target.value);
        }}
      />
    </div>
  );
};

export default TodoInput;
