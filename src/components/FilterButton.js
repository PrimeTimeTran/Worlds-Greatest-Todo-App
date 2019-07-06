import React from "react";
import { FaCircle, FaList, FaCheckCircle } from 'react-icons/fa';

const FilterButton = ({
  count,
  prompt,
  setNewFilter
}) => {
  return (
    <button className="Btn" onClick={() => setNewFilter(null)}>
      {prompt === 'All' && <FaList style={{ marginRight: 10 }} /> }
      {prompt === 'Done' && <FaCheckCircle style={{ marginRight: 10 }} /> }
      {prompt === 'Active' && <FaCircle style={{ marginRight: 10 }} /> }
      {prompt}
      ({count})
    </button>
  )
}

export default FilterButton