import React from "react";

import FilterButton from "./FilterButton";

const SortingOptions = ({ setNewFilter, allTodos, filter }) => {
  const allTodosCount = allTodos.length;
  const doneTodoItemsCount = allTodos.filter(todo => todo.status === "Done")
    .length;
  const activeTodoItemsCount = allTodos.filter(
    todo => todo.status === "Active"
  ).length;

  return (
    <div className="sorting-buttons">
      <FilterButton
        prompt="All"
        count={allTodosCount}
        focused={filter === null}
        setNewFilter={() => setNewFilter(null)}
      />
      <FilterButton
        prompt="Done"
        count={doneTodoItemsCount}
        focused={filter === "Done"}
        setNewFilter={() => setNewFilter("Done")}
      />
      <FilterButton
        prompt="Active"
        count={activeTodoItemsCount}
        focused={filter === "Active"}
        setNewFilter={() => setNewFilter("Active")}
      />
    </div>
  );
};

export default SortingOptions;
