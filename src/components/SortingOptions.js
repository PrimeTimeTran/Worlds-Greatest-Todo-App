import React from "react";

import FilterButton from "./FilterButton";

const SortingOptions = ({ setNewFilter, allTodoItems, filter }) => {
  const allTodoItemsCount = allTodoItems.length;
  const doneTodoItemsCount = allTodoItems.filter(todo => todo.status === "Done")
    .length;
  const activeTodoItemsCount = allTodoItems.filter(
    todo => todo.status === "Active"
  ).length;

  return (
    <div className="sorting-buttons">
      <FilterButton
        prompt="All"
        focused={filter === null}
        count={allTodoItemsCount}
        setNewFilter={() => setNewFilter(null)}
      />
      <FilterButton
        prompt="Done"
        focused={filter === 'Done'}
        count={doneTodoItemsCount}
        setNewFilter={() => setNewFilter("Done")}
      />
      <FilterButton
        prompt="Active"
        focused={filter === 'Active'}
        count={activeTodoItemsCount}
        setNewFilter={() => setNewFilter("Active")}
      />
    </div>
  );
};

export default SortingOptions;
