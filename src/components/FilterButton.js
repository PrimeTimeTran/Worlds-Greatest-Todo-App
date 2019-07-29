import React from "react";
import { FaCircle, FaList, FaCheckCircle } from "react-icons/fa";

const renderIcon = prompt => {
  switch (prompt) {
    case "All":
      return <FaList />;
    case "Done":
      return <FaCheckCircle />;
    case "Active":
      return <FaCircle />;
    default:
      return null;
  }
};

const FilterButton = ({ count, prompt, focused, setNewFilter }) => {
  return (
    <button
      onClick={setNewFilter}
      className={`Btn ${focused ? "Btn-Focused" : ""}`}
    >
      {renderIcon(prompt)}
      <div style={{ marginLeft: 10, marginRight: 10 }}>{prompt}</div>({count})
    </button>
  );
};

export default FilterButton;
