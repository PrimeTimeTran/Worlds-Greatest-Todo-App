import React from "react";

const TodoInput = (props) => {
  return (
    <div>
      <h1 className="Prompt Prompt-Title">Todo List</h1>
      <input
        autoFocus
        value={props.newTodoBody}
        onKeyDown={props.keyPress}
        className="NewTodoInput"
        placeholder={`Enter todo here ${
          props.currentUser.email !== undefined ? props.currentUser.email : ""
        }`}
        onChange={e => {
          props.setNewTodoItem(e.target.value);
        }}
      />
    </div>
  )
}

export default TodoInput