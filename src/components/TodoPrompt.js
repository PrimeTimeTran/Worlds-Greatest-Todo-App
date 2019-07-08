import React from "react";

const TodoPrompt = ({ todoList, currentUser }) => {
  const shouldShowPrompt = todoList.length === 0;

  const isSignedIn =
    currentUser.email !== "" && currentUser.email !== undefined;

  if (isSignedIn && shouldShowPrompt) {
    return <h1 className="Prompt">So much todo, so little time...</h1>;
  } else if (shouldShowPrompt) {
    return <h1 className="Prompt">Signin to save your todos</h1>;
  }
  return <div />;
};

export default TodoPrompt;
