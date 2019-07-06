import React from "react";

import FilterButton from "./FilterButton";

const SortingOptions = ({ setNewFilter, allTodoItems }) => {
  const allTodoItemsCount = allTodoItems.length;
  const doneTodoItemsCount = allTodoItems.filter(todo => todo.status === "done")
    .length;
  const activeTodoItemsCount = allTodoItems.filter(
    todo => todo.status === "active"
  ).length;

  return (
    <div className="SortingButtons">
      <FilterButton
        prompt="All"
        count={allTodoItemsCount}
        setNewFilter={() => setNewFilter(null)}
      />
      <FilterButton
        prompt="Done"
        count={doneTodoItemsCount}
        setNewFilter={() => setNewFilter("done")}
      />
      <FilterButton
        prompt="Active"
        count={activeTodoItemsCount}
        setNewFilter={() => setNewFilter("active")}
      />
    </div>
  );
};

export default SortingOptions;
