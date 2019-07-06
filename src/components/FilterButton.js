import React from "react";
import { FaCircle, FaList, FaCheckCircle } from 'react-icons/fa';

const FilterButton = ({
  count,
  prompt,
  focused,
  setNewFilter
}) => {
  return (
    <button className={`Btn ${focused ? 'Btn-Focused' : '' }`} onClick={setNewFilter}>
      {prompt === 'All' && <FaList /> }
      {prompt === 'Done' && <FaCheckCircle /> }
      {prompt === 'Active' && <FaCircle /> }
      <div style={{ marginLeft: 10, marginRight: 10 }}>
        {prompt}
      </div>
      ({count})
    </button>
  )
}

export default FilterButton